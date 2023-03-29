import styles from './OfficeId.module.scss'
import { type NextPage } from 'next'
import Head from 'next/head'
import { Table } from '~/components'
import { createColumnHelper } from '@tanstack/react-table'
import { getData } from '~/pages/api/getData'
import { useQuery } from '@tanstack/react-query'
import { Card } from '~/components/card'

export interface OfficeData {
  buildingNumber: string
  city: string
  country: string
  line: string
  officeId: number
  officeName: string
  postalCode: string
  province: string
  streetName: string
}

export interface SectorListData {
  sectorId: number
  sectorName: string
}

interface PageProps {
  officeId: string
  officeData: OfficeData
  sectorsData: SectorListData[]
}

const columnHelper = createColumnHelper<SectorListData>()

const getOfficeData = (officeId: string) => {
  return getData({ endpoint: `offices/${officeId}` })
}

const getSectors = (officeId: string) => {
  return getData({ endpoint: `offices/${officeId}/sectors` })
}

const Office: NextPage<PageProps> = ({
  officeId,
  officeData,
  sectorsData,
}: {
  officeId: string
  officeData: OfficeData
  sectorsData: SectorListData[]
}) => {
  const columns = [
    columnHelper.accessor('sectorName', {
      header: 'Sector Name',
      cell: (info) => <Table.Title>{info.getValue()}</Table.Title>,
    }),
    columnHelper.accessor('sectorId', {
      header: '',
      cell: (info) => (
        <Table.Link href={`/offices/${officeId}/${info.getValue()}`}>
          Access sector
        </Table.Link>
      ),
    }),
  ]

  const officeDataQuery = useQuery({
    queryKey: ['offices', officeId],
    queryFn: async () => getOfficeData(officeId),
    initialData: officeData,
  })

  const sectorsQuery = useQuery({
    queryKey: ['sectors', officeId],
    queryFn: async () => getSectors(officeId),
    initialData: sectorsData,
  })

  if (officeDataQuery.isLoading || sectorsQuery.isLoading) {
    return <span>Loading...</span>
  }

  if (officeDataQuery.isError || sectorsQuery.isError) {
    if (officeDataQuery.error instanceof Error) {
      return <span>Offices Data Error: {officeDataQuery.error.message}</span>
    }
    if (sectorsQuery.error instanceof Error) {
      return <span>Sectors Error: {sectorsQuery.error.message}</span>
    }
  }

  return (
    <>
      <Head>
        <title>Office Detail</title>
        <meta
          name="description"
          content="Details of an office inside the organization"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card title="Office Details">
          <Card.SectionTitle>Office Name</Card.SectionTitle>
          <Card.SectionContent>
            {officeDataQuery.data.officeName}
          </Card.SectionContent>
          <Card.SectionTitle>Address</Card.SectionTitle>
          <Card.SectionContent>
            {officeDataQuery.data.line}
            <br />
            {officeDataQuery.data.postalCode} {officeDataQuery.data.city}
            <br />
            {officeDataQuery.data.province}
            <br />
            {officeDataQuery.data.country}
          </Card.SectionContent>
          <Card.SectionTitle>Sectors</Card.SectionTitle>
          <Card.SectionContent>
            <Table columns={columns} data={sectorsQuery.data} />
          </Card.SectionContent>
        </Card>
      </main>
    </>
  )
}

export async function getServerSideProps(context: {
  params: { officeId: string }
}) {
  const officeId = context.params.officeId
  const officeData = await getOfficeData(officeId)
  const sectorsData = await getSectors(officeId)
  return { props: { officeId, officeData, sectorsData } }
}

export default Office

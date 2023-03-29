import styles from './SectorId.module.scss'
import { type NextPage } from 'next'
import Head from 'next/head'
import { Table } from '~/components'
import { createColumnHelper } from '@tanstack/react-table'
import { getData } from '~/pages/api/getData'
import { useQuery } from '@tanstack/react-query'
import { Card } from '~/components/card'

export interface SectorData {
  sectorId: number
  sectorName: string
}

export interface WorkstationListData {
  isPermanent: boolean
  isReserved: boolean
  position: number
  workstationId: number
  workstationName: string
}

interface PageProps {
  officeId: string
  sectorId: string
  sectorData: SectorData
  workstationsData: WorkstationListData[]
}

const getSectorData = (officeId: string, sectorId: string) => {
  return getData({ endpoint: `offices/${officeId}/sectors/${sectorId}` })
}

const getWorkstations = (officeId: string, sectorId: string) => {
  return getData({
    endpoint: `offices/${officeId}/sectors/${sectorId}/workstations`,
  })
}

const columnHelper = createColumnHelper<WorkstationListData>()

const Sector: NextPage<PageProps> = ({
  officeId,
  sectorId,
  sectorData,
  workstationsData,
}: {
  officeId: string
  sectorId: string
  sectorData: SectorData
  workstationsData: WorkstationListData[]
}) => {
  const columns = [
    columnHelper.accessor('workstationName', {
      header: 'Workstation',
      cell: (info) => <Table.Title>{info.getValue()}</Table.Title>,
    }),
    columnHelper.accessor('position', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('isReserved', {
      header: 'Reserved',
      cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    }),
    columnHelper.accessor('isPermanent', {
      header: 'Permanent',
      cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    }),
    columnHelper.accessor('workstationId', {
      header: '',
      cell: (info) => (
        <Table.Link
          href={`/offices/${officeId}/${sectorId}/${info.getValue()}`}
        >
          Access workstation
        </Table.Link>
      ),
    }),
  ]

  const sectorDataQuery = useQuery({
    queryKey: ['sectors', officeId, sectorId],
    queryFn: async () => getSectorData(officeId, sectorId),
    initialData: sectorData,
  })

  const workstationsQuery = useQuery({
    queryKey: ['sectors', sectorId],
    queryFn: async () => getWorkstations(officeId, sectorId),
    initialData: workstationsData,
  })

  if (sectorDataQuery.isLoading || workstationsQuery.isLoading) {
    return <span>Loading...</span>
  }

  if (sectorDataQuery.isError || workstationsQuery.isError) {
    if (sectorDataQuery.error instanceof Error) {
      return <span>Sector Data Error: {sectorDataQuery.error.message}</span>
    }
    if (workstationsQuery.error instanceof Error) {
      return <span>Workstations Error: {workstationsQuery.error.message}</span>
    }
  }

  return (
    <>
      <Head>
        <title>Sector Detail</title>
        <meta
          name="description"
          content="Details of a sector of an office inside the organization"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card title="Sector Details">
          <Card.SectionTitle>Name</Card.SectionTitle>
          <Card.SectionContent>
            {sectorDataQuery.data.sectorName}
          </Card.SectionContent>
          <Card.SectionTitle>Workstations</Card.SectionTitle>
          <Card.SectionContent>
            <Table columns={columns} data={workstationsQuery.data} />
          </Card.SectionContent>
        </Card>
      </main>
    </>
  )
}

export async function getServerSideProps(context: {
  params: { officeId: string; sectorId: string }
}) {
  const officeId = context.params.officeId
  const sectorId = context.params.sectorId
  const sectorData = await getSectorData(officeId, sectorId)
  const workstationsData = await getWorkstations(officeId, sectorId)

  return { props: { officeId, sectorId, sectorData, workstationsData } }
}

export default Sector

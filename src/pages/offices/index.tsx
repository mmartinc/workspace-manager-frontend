import styles from './Offices.module.scss'
import { type NextPage } from 'next'
import Head from 'next/head'
import { Table } from '~/components'
import { createColumnHelper } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { getData } from '~/pages/api/getData'
import { Card } from '~/components/card'

export interface OfficeListData {
  country: string
  officeId: number
  officeName: string
  province: string
}

interface PageProps {
  officesData: OfficeListData[]
}

const columnHelper = createColumnHelper<OfficeListData>()

const getOffices = () => {
  return getData({ endpoint: 'offices' })
}

const columns = [
  columnHelper.accessor('officeName', {
    header: 'Office Name',
    cell: (info) => <Table.Title>{info.getValue()}</Table.Title>,
  }),
  columnHelper.accessor('province', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('country', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('officeId', {
    header: '',
    cell: (info) => (
      <Table.Link href={`/offices/${info.getValue()}`}>
        <span>Access</span>
      </Table.Link>
    ),
  }),
]

const Offices: NextPage<PageProps> = ({ officesData }) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['offices'],
    queryFn: getOffices,
    initialData: officesData,
  })

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    if (error instanceof Error) {
      return <span>Error: {error.message}</span>
    }
  }

  return (
    <>
      <Head>
        <title>List of Offices</title>
        <meta
          name="description"
          content="List of offices inside the organization"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card title="Offices">
          <Table columns={columns} data={data} />
        </Card>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const officesData = await getOffices()
  return { props: { officesData } }
}

export default Offices

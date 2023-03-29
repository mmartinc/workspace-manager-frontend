import styles from './Reservations.module.scss'
import { type NextPage } from 'next'
import Head from 'next/head'
import { Table } from '~/components'
import { createColumnHelper } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { getData } from '~/pages/api/getData'
import { Card } from '~/components/card'

export interface ReservationListData {
  employeeName: string
  finishingDate: Date
  isPermanent: boolean
  officeName: string
  position: number
  reservationId: number
  startingDate: Date
  workstationName: string
}

interface PageProps {
  reservationsData: ReservationListData[]
}

const columnHelper = createColumnHelper<ReservationListData>()

const getReservations = () => {
  return getData({ endpoint: 'reservations' })
}

const columns = [
  columnHelper.accessor('employeeName', {
    header: 'Employee',
    cell: (info) => <Table.Title>{info.getValue()}</Table.Title>,
  }),
  columnHelper.accessor('officeName', {
    header: 'Office',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('isPermanent', {
    header: 'Permanent',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
  }),
  columnHelper.accessor('startingDate', {
    header: 'Starting Date',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('finishingDate', {
    header: 'Finishing Date',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('reservationId', {
    header: '',
    cell: (info) => (
      <Table.Link href={`/reservations/${info.getValue()}`}>
        Access Reservation
      </Table.Link>
    ),
  }),
]

const Reservations: NextPage<PageProps> = ({ reservationsData }) => {
  const reservationsDataQuery = useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
    initialData: reservationsData,
  })

  if (reservationsDataQuery.isLoading) {
    return <span>Loading...</span>
  }

  if (reservationsDataQuery.isError) {
    if (reservationsDataQuery.error instanceof Error) {
      return <span>Error: {reservationsDataQuery.error.message}</span>
    }
  }

  return (
    <>
      <Head>
        <title>List of Reservations</title>
        <meta
          name="description"
          content="List of reservations of the logged in employee"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card title="Reservations">
          <Table columns={columns} data={reservationsDataQuery.data} />
        </Card>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const reservationsData = await getReservations()
  return { props: { reservationsData } }
}

export default Reservations

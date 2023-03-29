import styles from './ReservationId.module.scss'
import { type NextPage } from 'next'
import Head from 'next/head'
import { getData } from '~/pages/api/getData'
import { useQuery } from '@tanstack/react-query'
import { Card } from '~/components/card'

export interface ReservationData {
  country: string
  employeeId: number
  employeeName: string
  finishingDate: Date
  isPermanent: boolean
  isReserved: boolean
  officeId: number
  officeName: string
  position: number
  province: string
  reservationId: number
  sectorId: number
  sectorName: string
  startingDate: Date
  workstationId: number
  workstationName: string
}

interface PageProps {
  reservationId: string
  reservationData: ReservationData
}

const getReservationData = (
  reservationId: string
): Promise<ReservationData> => {
  return getData({
    endpoint: `reservations/${reservationId}`,
  })
}

const Reservation: NextPage<PageProps> = ({
  reservationId,
  reservationData,
}: {
  reservationId: string
  reservationData: ReservationData
}) => {
  const reservationDataQuery = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: async () => getReservationData(reservationId),
    initialData: reservationData,
  })

  return (
    <>
      <Head>
        <title>Reservation Detail</title>
        <meta
          name="description"
          content="Details of a reservation assigned to the logged in employee"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card
          title={`${
            reservationDataQuery.data.isPermanent ? 'Permanent ' : ''
          }Reservation
          for ${reservationDataQuery.data.employeeName}`}
        >
          {reservationDataQuery.data.isPermanent ? (
            ''
          ) : (
            <>
              <Card.SectionTitle>Reservation Dates</Card.SectionTitle>
              <Card.SectionContent>
                Starting date:{' '}
                {reservationDataQuery.data.startingDate?.toLocaleString()}
                Finishing date:{' '}
                {reservationDataQuery.data.finishingDate?.toLocaleString()}
              </Card.SectionContent>
            </>
          )}
          <Card.SectionTitle>Workstation</Card.SectionTitle>
          <Card.SectionContent>
            {reservationDataQuery.data.workstationName}, Position{' '}
            {reservationDataQuery.data.position}
          </Card.SectionContent>
          <Card.SectionTitle>Sector</Card.SectionTitle>
          <Card.SectionContent>
            {reservationDataQuery.data.sectorName}
          </Card.SectionContent>
          <Card.SectionTitle>Office</Card.SectionTitle>
          <Card.SectionContent>
            {reservationDataQuery.data.officeName}
            <br />
            {reservationDataQuery.data.province}
            <br />
            {reservationDataQuery.data.country}
          </Card.SectionContent>
        </Card>
      </main>
    </>
  )
}

export async function getServerSideProps(context: {
  params: { reservationId: string }
}) {
  const reservationId = context.params.reservationId
  const reservationData = await getReservationData(reservationId)

  return { props: { reservationId, reservationData } }
}

export default Reservation

import styles from './WorkstationId.module.scss'
import { type NextPage } from 'next'
import Head from 'next/head'
import { getData } from '~/pages/api/getData'
import { useQuery } from '@tanstack/react-query'
import { Card } from '~/components/card'

export interface WorkstationData {
  isPermanent: boolean
  isReserved: boolean
  position: number
  rotation: number
  workstationId: number
  workstationName: string
  xCoordinate: number
  yCoordinate: number
}

interface PageProps {
  officeId: string
  sectorId: string
  workstationId: string
  workstationData: WorkstationData
}

const getWorkstationData = (
  officeId: string,
  sectorId: string,
  workstationId: string
) => {
  return getData({
    endpoint: `offices/${officeId}/sectors/${sectorId}/workstations/${workstationId}`,
  })
}

const Workstation: NextPage<PageProps> = ({
  officeId,
  sectorId,
  workstationId,
  workstationData,
}: {
  officeId: string
  sectorId: string
  workstationId: string
  workstationData: WorkstationData
}) => {
  const workstationDataQuery = useQuery({
    queryKey: ['workstation', workstationId],
    queryFn: async () => getWorkstationData(officeId, sectorId, workstationId),
    initialData: workstationData,
  })

  return (
    <>
      <Head>
        <title>Workstation Detail</title>
        <meta
          name="description"
          content="Details of a workstation inside a sector of an office of the organization"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Card title="Workstation Details">
          <Card.SectionTitle>Workstation Name</Card.SectionTitle>
          <Card.SectionContent>
            {workstationDataQuery.data.workstationName}
          </Card.SectionContent>
          <Card.SectionTitle>Position</Card.SectionTitle>
          <Card.SectionContent>
            {workstationDataQuery.data.position}
          </Card.SectionContent>
          <Card.SectionTitle>Rotation</Card.SectionTitle>
          <Card.SectionContent>
            {workstationDataQuery.data.rotation}
          </Card.SectionContent>
          <Card.SectionTitle>X Coordinate on map</Card.SectionTitle>
          <Card.SectionContent>
            {workstationDataQuery.data.xCoordinate}
          </Card.SectionContent>
          <Card.SectionTitle>Y Coordinate on map</Card.SectionTitle>
          <Card.SectionContent>
            {workstationDataQuery.data.yCoordinate}
          </Card.SectionContent>
          <Card.SectionTitle>Is it permanently reserved?</Card.SectionTitle>
          <Card.SectionContent>
            {workstationDataQuery.data.isPermanent ? 'Yes' : 'No'}
          </Card.SectionContent>
        </Card>
        {/* <p>Workstation: {workstationDataQuery.data.workstationName}</p>
        <p>Position: {workstationDataQuery.data.position}</p>
        <p>Rotation: {workstationDataQuery.data.rotation}</p>
        <p>X Coordinate on map: {workstationDataQuery.data.xCoordinate}</p>
        <p>Y Coordinate on map: {workstationDataQuery.data.yCoordinate}</p>
        <p>
          Is it permanently reserved?:{' '}
          {workstationDataQuery.data.isPermanent ? 'Yes' : 'No'}
        </p> */}
      </main>
    </>
  )
}

export async function getServerSideProps(context: {
  params: { officeId: string; sectorId: string; workstationId: string }
}) {
  const officeId = context.params.officeId
  const sectorId = context.params.sectorId
  const workstationId = context.params.workstationId

  const workstationData = await getWorkstationData(
    officeId,
    sectorId,
    workstationId
  )
  return { props: { officeId, sectorId, workstationId, workstationData } }
}

export default Workstation

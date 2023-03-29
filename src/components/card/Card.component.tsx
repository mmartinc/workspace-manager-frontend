import styles from './Card.module.scss'
import type { PropsWithChildren } from 'react'

export interface ICardProps {
  title: string
}

export const Card = (props: PropsWithChildren<ICardProps>) => (
  <div className={styles.card}>
    <CardTitle>{props.title}</CardTitle>
    <div className={styles.sections}>{props.children}</div>
  </div>
)

const CardTitle = (props: PropsWithChildren) => {
  return <div className={styles.title}>{props.children}</div>
}

const SectionTitle = (props: PropsWithChildren) => {
  return <div className={styles.sectionTitle}>{props.children}</div>
}

const SectionContent = (props: PropsWithChildren) => {
  return <div className={styles.sectionContent}>{props.children}</div>
}

Card.SectionTitle = SectionTitle
Card.SectionContent = SectionContent

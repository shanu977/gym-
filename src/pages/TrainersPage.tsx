import { SectionHeading } from '../components/SectionHeading'
import { TrainerCard } from '../components/TrainerCard'
import { trainers } from '../data/siteData'
import { PageWrap } from '../components/PageShell'
export function TrainersPage() { return <PageWrap><SectionHeading eyebrow="The team" title="People who see your potential." copy="Personal, precise and invested in your progress." /><div className="trainer-grid page-grid">{trainers.map((trainer) => <TrainerCard key={trainer.name} trainer={trainer} />)}</div></PageWrap> }

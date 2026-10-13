import { ProgramCard } from '../components/ProgramCard'
import { SectionHeading } from '../components/SectionHeading'
import { programs } from '../data/siteData'
import { PageWrap } from '../components/PageShell'
export function ProgramsPage() { return <PageWrap><SectionHeading eyebrow="Training programs" title="A practice that compounds." copy="Choose your focus. We'll help you build the discipline to stay with it." /> <div className="program-grid page-grid">{programs.map((program) => <ProgramCard key={program.title} program={program} />)}</div></PageWrap> }

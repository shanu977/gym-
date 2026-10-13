import { Activity, ArrowUpRight, Dumbbell, Flame, Target } from 'lucide-react'
import type { Program } from '../types'
import { Link } from 'react-router-dom'
const icons = { dumbbell: Dumbbell, flame: Flame, activity: Activity, person: Activity, target: Target }
export function ProgramCard({ program }: { program: Program }) { const Icon = icons[program.icon]; return <article className="program-card"><div className="program-image"><img className="image-cover" src={program.image} alt={`${program.title} program`} /><span className="program-icon"><Icon size={20} /></span></div><div className="program-body"><div className="program-meta"><span>{program.category}</span><span>{program.duration}</span></div><h3 className="display">{program.title}</h3><p>{program.description}</p><Link to={`/programs/${program.id}`} className="text-link">View program <ArrowUpRight size={16} /></Link></div></article> }

import { ArrowUpRight, Star } from 'lucide-react'
import type { Trainer } from '../types'
import { Link } from 'react-router-dom'
export function TrainerCard({ trainer }: { trainer: Trainer }) { return <article className="trainer-card"><div className="trainer-image"><img className="image-cover" src={trainer.image} alt={`${trainer.name}, ${trainer.discipline}`} /><span>{trainer.accent}</span></div><div className="trainer-body"><h3 className="display">{trainer.name}</h3><p>{trainer.discipline}</p><div className="trainer-meta"><span>{trainer.experience}</span><span><Star size={12} fill="currentColor" /> {trainer.rating}</span></div><Link to={`/trainers/${trainer.id}`} className="text-link" aria-label={`View ${trainer.name}`}><ArrowUpRight size={16} /></Link></div></article> }

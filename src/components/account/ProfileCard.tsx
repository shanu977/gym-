import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAccount } from '../../contexts/useAccount'

export function ProfileCard() { const { customer } = useAccount(); return <section className="account-card profile-card"><div className="account-card-heading"><div><span className="eyebrow">Personal profile</span><h2 className="display">Keep it<br /><em>yours.</em></h2></div><Link className="text-link" to="/account/profile">Edit profile <ArrowRight size={15} /></Link></div><div className="profile-card-body"><div className="account-avatar account-avatar-large">{customer.firstName[0]}{customer.lastName[0]}</div><div><h3>{customer.firstName} {customer.lastName}</h3><p>{customer.bio}</p><div className="profile-contact"><span><Mail size={14} />{customer.email}</span><span><Phone size={14} />{customer.phone}</span><span><MapPin size={14} />{customer.location}</span></div></div></div></section> }

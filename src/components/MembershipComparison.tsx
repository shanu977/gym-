import type { Membership } from '../types'
import { formatINR } from '../data/membershipData'

const rows: { label: string; key: keyof Membership }[] = [{ label: 'Gym access', key: 'gymAccess' }, { label: 'Equipment', key: 'equipmentAccess' }, { label: 'Group classes', key: 'groupClasses' }, { label: 'Personal training', key: 'personalTraining' }, { label: 'Trainer access', key: 'trainerAccess' }, { label: 'Locker', key: 'lockerAccess' }, { label: 'Nutrition support', key: 'nutritionSupport' }, { label: 'Guest passes', key: 'guestPasses' }, { label: 'Access hours', key: 'accessHours' }]

export function MembershipComparison({ plans }: { plans: Membership[] }) { return <div className="comparison-wrap"><table className="comparison-table"><caption>Compare membership benefits</caption><thead><tr><th>Compare</th>{plans.map((plan) => <th key={plan.id}><span>{plan.name}</span><small>{formatINR(plan.monthlyPrice)} / month</small></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.key}><th>{row.label}</th>{plans.map((plan) => <td key={plan.id}>{plan[row.key]}</td>)}</tr>)}</tbody></table></div> }

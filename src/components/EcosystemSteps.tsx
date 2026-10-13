import { Activity, Compass, ShoppingBag, Sparkles, Target, UserRound } from 'lucide-react'

const steps = [{ label: 'Discover', copy: 'Find your focus.', icon: Compass }, { label: 'Join', copy: 'Choose your standard.', icon: UserRound }, { label: 'Train', copy: 'Do the work.', icon: Activity }, { label: 'Shop', copy: 'Fuel the journey.', icon: ShoppingBag }, { label: 'Track', copy: 'See progress clearly.', icon: Target }, { label: 'Transform', copy: 'Live at your peak.', icon: Sparkles }]

export function EcosystemSteps() { return <div className="ecosystem-steps">{steps.map(({ label, copy, icon: Icon }, index) => <div className="ecosystem-step" key={label}><span className="ecosystem-number">0{index + 1}</span><Icon size={22} strokeWidth={1.4} /><strong>{label}</strong><p>{copy}</p>{index < steps.length - 1 && <span className="step-line" />}</div>)}</div> }

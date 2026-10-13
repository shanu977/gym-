import { Link } from 'react-router-dom'
import { PageWrap } from '../components/PageShell'
export function NotFoundPage() { return <PageWrap><div className="not-found"><span className="eyebrow">404 / Off the map</span><h1 className="display">Nothing here.<br /><em>Yet.</em></h1><Link className="button-primary" to="/">Return home</Link></div></PageWrap> }

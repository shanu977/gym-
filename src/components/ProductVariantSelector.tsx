import { useState } from 'react'
import type { ProductVariant } from '../types'

export function ProductVariantSelector({ variants, onChange }: { variants: ProductVariant[]; onChange?: (variants: Record<string, string>) => void }) {
  const groups = variants.reduce<Record<string, string[]>>((result, variant) => { (result[variant.name] ??= []).push(variant.value); return result }, {})
  const [selected, setSelected] = useState<Record<string, string>>(() => Object.fromEntries(Object.entries(groups).map(([name, values]) => [name, values[0]])))
  const choose = (name: string, value: string) => { const next = { ...selected, [name]: value }; setSelected(next); onChange?.(next) }
  return <div className="variant-selector">{Object.entries(groups).map(([name, values]) => <fieldset key={name}><legend>{name}<strong>{selected[name]}</strong></legend><div className="variant-options">{values.map((value) => <button className={selected[name] === value ? 'is-active' : ''} type="button" key={value} onClick={() => choose(name, value)} aria-pressed={selected[name] === value}>{value}</button>)}</div></fieldset>)}</div>
}

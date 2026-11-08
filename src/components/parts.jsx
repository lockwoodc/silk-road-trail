// Shared pieces of the game's interface: panels, stat bars, supply chips, buttons.
import { Icon, Ornament, Camel } from './art.jsx';
import { cx } from './cx.js';
import { GOODS, SUPPLIES } from '../game/data.js';
import { dateLabel } from '../game/engine.js';

export function Panel({ children, className = '', as: Tag = 'section', ...rest }) {
  return (
    <Tag className={cx('frame rounded-lg p-4 sm:p-5', className)} {...rest}>
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

export function PanelTitle({ children, icon, right }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
        {icon && <span className="text-gold"><Icon name={icon} size={18} /></span>}
        {children}
      </h2>
      {right}
    </div>
  );
}

export function OrnamentalHeading({ children, className = '' }) {
  return (
    <div className={cx('flex flex-col items-center gap-2 text-center', className)}>
      <Ornament className="text-gold" width={240} />
      <h1 className="font-display text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl">{children}</h1>
      <Ornament className="text-gold" width={240} />
    </div>
  );
}

const TONE = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  danger: 'var(--danger)',
  gold: 'var(--gold)',
  accent: 'var(--accent)',
};

export function StatBar({ label, value, max = 100, tone = 'ok', icon, compact = false, suffix }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx('min-w-0', compact ? '' : 'space-y-1')}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="smallcaps flex items-center gap-1.5 text-xs text-ink-2">
          {icon && <Icon name={icon} size={13} />}
          {label}
        </span>
        <span className="font-display text-sm font-semibold tabular-nums text-ink">{suffix ?? Math.round(value)}</span>
      </div>
      <div className="bar-track" role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={max}>
        <div className="bar-fill" style={{ width: `${pct}%`, background: TONE[tone] }} />
      </div>
    </div>
  );
}

export function SupplyChip({ icon, label, value, warnAt = 0, unit }) {
  const low = value <= warnAt;
  return (
    <div
      className={cx(
        'flex items-center gap-2 rounded-md border px-2.5 py-1.5',
        low ? 'border-danger/60 bg-danger-soft' : 'border-line bg-surface-2/60',
      )}
      title={`${label}${unit ? ` (${unit})` : ''}`}
    >
      <span className={low ? 'text-danger' : 'text-ink-2'}><Icon name={icon} size={16} /></span>
      <span className="smallcaps text-xs text-ink-2">{label}</span>
      <span className={cx('ml-auto font-display text-base font-semibold tabular-nums', low ? 'text-danger' : 'text-ink')}>{value}</span>
    </div>
  );
}

export function Coin({ amount, className = '' }) {
  return (
    <span className={cx('inline-flex items-center gap-1 font-display font-semibold tabular-nums', className)}>
      <Icon name="coin" size={15} className="text-gold" />
      {amount}
      <span className="smallcaps text-xs font-normal text-ink-3">bezants</span>
    </span>
  );
}

export function Btn({ children, variant = 'secondary', size = 'md', className = '', icon, ...rest }) {
  const base =
    'inline-flex select-none items-center justify-center gap-2 rounded-md border font-medium transition-[background-color,color,border-color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0';
  const sizes = { sm: 'min-h-[36px] px-3 text-sm', md: 'min-h-[44px] px-4 text-base', lg: 'min-h-[52px] px-6 text-lg' };
  const variants = {
    primary: 'border-accent bg-accent text-accent-ink hover:bg-accent-hover',
    secondary: 'border-line-strong bg-surface text-ink hover:border-ink-3 hover:bg-surface-2',
    ghost: 'border-transparent bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink',
    gold: 'border-gold bg-gold-soft text-ink hover:border-gold',
    danger: 'border-danger/70 bg-danger-soft text-danger hover:border-danger',
  };
  return (
    <button type="button" className={cx(base, sizes[size], variants[variant], className)} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

// A row of mutually exclusive options (pace, rations, town sections) that reads as one control.
export function Segmented({ label, options, value, onChange, icon, className = '', dense = false }) {
  return (
    <div className={className}>
      {label && <div className="smallcaps mb-1.5 text-[10px] text-ink-3">{label}</div>}
      <div role="group" aria-label={label} className="flex rounded-md border border-line-strong bg-surface-2/50 p-0.5">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              title={o.blurb}
              className={cx(
                'flex flex-1 items-center justify-center gap-1.5 rounded-sm px-2 transition-colors duration-150',
                dense ? 'min-h-[36px] text-xs' : 'min-h-[40px] text-sm',
                active ? 'bg-surface text-ink shadow-card' : 'text-ink-3 hover:text-ink',
              )}
            >
              {icon && <Icon name={icon(o.id)} size={13} className={active ? 'text-gold' : ''} />}
              <span className="smallcaps">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// The one bar at the top of every in-game screen: where you are, the date, what you carry.
export function GameBar({ state, children }) {
  return (
    <header className="sticky top-0 z-30 -mx-3 mb-3 border-b border-line bg-bg/95 px-3 py-2 backdrop-blur-sm sm:-mx-5 sm:px-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-gold"><Camel size={26} tint="currentColor" /></span>
          <div className="min-w-0">
            <div className="truncate font-display text-lg font-semibold leading-tight text-ink">{state.caravanName}</div>
            <div className="smallcaps text-[10px] leading-tight text-ink-3">{state.era.year} · {dateLabel(state)}</div>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-sm text-ink">
            <Icon name="coin" size={14} className="text-gold" />
            <span className="font-display font-semibold tabular-nums">{state.coin}</span>
            <span className="smallcaps text-[10px] text-ink-3">bezants</span>
          </span>
          {children}
        </div>
      </div>
    </header>
  );
}

// A small icon button for the top bar, 44px, with a tooltip label.
export function BarBtn({ icon, label, onClick, active = false, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cx(
        'flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border px-2 transition-colors duration-150 sm:h-10 sm:min-w-10',
        active ? 'border-gold bg-gold-soft text-ink' : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
      )}
      {...rest}
    >
      <Icon name={icon} size={16} />
      <span className="smallcaps hidden text-xs sm:inline">{label}</span>
    </button>
  );
}

export function GoodRow({ id, qty, price, onBuy, onSell, buyLabel = 'Buy', sellLabel = 'Sell', sellPrice }) {
  const good = GOODS[id];
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line/70 py-2.5 last:border-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-ink-2">
        <Icon name={{ silk: 'silk', spices: 'spice', porcelain: 'vase', paper: 'paper', horses: 'horse', glass: 'glass', frankincense: 'incense' }[id]} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-semibold text-ink">{good.name}</span>
          <span className="smallcaps text-xs text-ink-3">per {good.unit}</span>
        </div>
        <p className="truncate text-xs text-ink-3" title={good.blurb}>{good.blurb}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <Btn size="sm" variant="secondary" onClick={onBuy} disabled={!onBuy} aria-label={`${buyLabel} one ${good.unit} of ${good.name} for ${price} bezants`}>
          <Icon name="coin" size={12} className="text-gold" />{price}
        </Btn>
        <span className="min-w-8 text-center font-display text-base font-semibold tabular-nums text-ink" aria-label={`You carry ${qty || 0}`}>{qty || 0}</span>
        <Btn size="sm" variant="ghost" onClick={onSell} disabled={!onSell || !qty} aria-label={`${sellLabel} one ${good.unit} of ${good.name}${sellPrice != null ? ` for ${sellPrice} bezants` : ''}`}>
          {sellPrice != null ? <span className="inline-flex items-center gap-1"><Icon name="coin" size={12} className="text-gold" />{sellPrice}</span> : '−1'}
        </Btn>
      </div>
    </div>
  );
}

export function SupplyRow({ id, qty, price, onBuy, onSell, unit, disabled, title, blurb }) {
  const sup = SUPPLIES[id] || {};
  const label = title || sup.name;
  const text = blurb || sup.blurb;
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line/70 py-2.5 last:border-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-ink-2">
        <Icon name={id === 'rope' ? 'rope' : id} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-semibold text-ink">{label}</span>
          <span className="smallcaps text-xs text-ink-3">per {unit || sup.unit}</span>
        </div>
        <p className="truncate text-xs text-ink-3" title={text}>{text}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <Btn size="sm" variant="secondary" onClick={onBuy} disabled={disabled} aria-label={`Buy one ${unit || sup.unit} of ${label} for ${price} bezants`}>
          <Icon name="coin" size={12} className="text-gold" />{price}
        </Btn>
        <span className="min-w-8 text-center font-display text-base font-semibold tabular-nums text-ink" aria-label={`You carry ${qty}`}>{qty}</span>
        <Btn size="sm" variant="ghost" onClick={onSell} disabled={!onSell} aria-label={`Sell one ${unit || sup.unit} of ${label}`}>−1</Btn>
      </div>
    </div>
  );
}

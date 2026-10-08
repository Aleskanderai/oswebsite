import './product-hunt-badge.css'

export function ProductHuntBadge({ placement }: { placement: 'hero' | 'nav' }) {
  return (
    <a
      href="https://www.producthunt.com/products/openswarm-3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-openswarm-3"
      target="_blank"
      rel="noopener noreferrer"
      className={`product-hunt-badge product-hunt-badge--${placement}`}
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1271048&theme=light&t=1791467743641"
        alt="OpenSwarm - A swarm of agents, in the same place you work | Product Hunt"
        width={250}
        height={54}
      />
    </a>
  )
}

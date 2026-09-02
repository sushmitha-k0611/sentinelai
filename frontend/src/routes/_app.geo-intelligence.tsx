import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/geo-intelligence')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/geo-intelligence"!</div>
}

export default function Page({ params }: { params: { id: string } }) {
  return <div>Vinyl: {params.id}</div>
}

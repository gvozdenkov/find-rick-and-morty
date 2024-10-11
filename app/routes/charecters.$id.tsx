import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import { getCharacter } from 'rickmortyapi';

export const loader: LoaderFunction = async ({ params }) => {
  const { data } = await getCharacter(+params.id!);
  return json({ data });
};

export default function Charecter() {
  const navigate = useNavigate();
  const { data } = useLoaderData<typeof loader>();
  const { name, gender, image, location, status, species } = data;
  console.log('charecter:', data);

  return (
    <section className="flex gap-4 flex-col h-screen items-center justify-center">
      <img src={image} alt={`${name} avatar.`} className="rounded-full" />
      <h1>{name}</h1>
      <p>Gender: {gender}</p>
      <p>Species: {species}</p>
      <p>Status: {status}</p>
      <p>Location: {location.name}</p>
      <button onClick={() => navigate(-1)} className="border pl-6 pr-6 pt-2 pb-2" type="button">
        Back
      </button>
    </section>
  );
}

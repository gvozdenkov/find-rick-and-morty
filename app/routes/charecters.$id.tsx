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
    <div className="flex flex-col gap-8 items-start">
      <article className="grid grid-rows-[1fr_2fr] sm:grid-rows-1 sm:grid-cols-[1fr_2fr] | w-full bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden">
        <img src={image} alt={`${name} avatar.`} className="w-full h-full object-cover" />
        <div className="flex flex-col gap-4 p-4">
          <header>
            <h1 className="text-2xl font-bold">{name}</h1>
            {
              <>
                <p className="text-slate-400">
                  {species} / {gender}
                </p>
                <p className={`status status_${status.toLowerCase()}`}>{status}</p>
              </>
            }
          </header>
          <ul>
            <li className="flex flex-col text-base mb-4">
              <span className="text-slate-500">Last known location:</span> {location.name}
            </li>
          </ul>
        </div>
      </article>
      <button onClick={() => navigate(-1)} className="border pl-6 pr-6 pt-2 pb-2" type="button">
        Back
      </button>
    </div>
  );
}

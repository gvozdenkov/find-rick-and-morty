import {
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';

import { getCharacter, getLocation } from 'rickmortyapi';
import { getLastUrlSegment } from '~/utils';

export const clientLoader: ClientLoaderFunction = async ({ params }: ClientLoaderFunctionArgs) => {
  const { data: locationData } = await getLocation(+params.id!);

  const residentIds = locationData.residents.reduce((acc, curr) => {
    const residentId = getLastUrlSegment(curr);
    acc.push(+residentId);

    return acc;
  }, []);

  const { data: residentsData } = await getCharacter(residentIds);

  return { locationData, residentsData };
};

export default function Location() {
  const navigate = useNavigate();
  const { locationData, residentsData } = useLoaderData<typeof clientLoader>();

  const { name, type } = locationData;

  return (
    <div className="flex flex-col gap-8 items-center">
      <article className="grid w-full border border-gray-700 rounded-3xl overflow-hidden | sm:grid-rows-1">
        <div className="flex flex-col gap-4 p-4">
          <header className="mb-10">
            <h1 className="text-2xl font-bold">{name}</h1>
            {<p className="text-slate-400">{type}</p>}
          </header>
          <h2 className="text-2xl">
            Residents&nbsp;<span className="text-slate-500">{residentsData.length} charecters</span>
          </h2>
          <ul className="flex flex-col gap-2 w-full">
            {residentsData!.map((charecter) => (
              <li key={charecter.id} className="border rounded hover:bg-white hover:bg-opacity-10">
                <Link
                  to={`/charecters/${charecter.id}`}
                  className="flex gap-2 items-center p-2"
                  title={charecter.name}
                >
                  <div className="flex flex-col | sm:flex-row sm:gap-2 sm:items-center">
                    <span>{charecter.name}</span>
                    <span className="text-xs text-slate-500">
                      {charecter.species} / {charecter.gender}
                    </span>
                  </div>
                  <span
                    className={`status status_${charecter.status.toLocaleLowerCase()} | ml-auto`}
                  >
                    {charecter.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
      <button onClick={() => navigate(-1)} className="button" type="button">
        Back
      </button>
    </div>
  );
}

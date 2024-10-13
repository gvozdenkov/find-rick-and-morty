import {
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';

import { Character, getCharacter, getLocation } from 'rickmortyapi';
import { CharecterSearchResultItem } from '~/charecter-search-result-item';
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
            {residentsData!.map((charecter: Character) => (
              <CharecterSearchResultItem charecter={charecter} key={charecter.id} />
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

import {
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';

import { getCharacter } from 'rickmortyapi';
import { getLastUrlSegment } from '~/utils';

export const clientLoader: ClientLoaderFunction = async ({ params }: ClientLoaderFunctionArgs) => {
  const { data } = await getCharacter(+params.id!);
  const locationUrl = data.location.url;
  const locationId = getLastUrlSegment(locationUrl);
  return { data, locationId };
};

export default function Charecter() {
  const navigate = useNavigate();
  const { data, locationId } = useLoaderData<typeof clientLoader>();

  const { name, gender, image, location, status, species } = data;

  return (
    <div className="flex flex-col gap-8 items-center">
      <article className="grid w-full border border-gray-700 rounded-3xl overflow-hidden | sm:grid-rows-1 sm:grid-cols-[1fr_2fr]">
        <img src={image} alt={`${name} avatar.`} className="w-full h-full object-cover" />
        <div className="flex flex-col gap-6 p-4">
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
          <dl className="flex flex-col gap-2">
            <div className="flex flex-col text-base">
              <dt className="text-slate-500">Last known location:</dt>
              <dt>
                <Link to={`/location/${locationId}`} className="text-link">
                  {location.name}
                </Link>
              </dt>
            </div>
          </dl>
        </div>
      </article>
      <button onClick={() => navigate(-1)} className="button" type="button">
        Back
      </button>
    </div>
  );
}

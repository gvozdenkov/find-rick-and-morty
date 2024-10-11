import { Form, Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Character, getCharacters, Info } from 'rickmortyapi';

export const meta: MetaFunction = () => {
  return [
    { title: 'Rick and Morty Search' },
    { name: 'description', content: 'Find any character from the Rick and Morty universe' },
    { name: 'author', content: 'arty gvozdenkov' },
  ];
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const q = Object.fromEntries(formData);
  const cheracter = await getCharacters({
    name: q.name as string,
    status: q.status as string,
    species: q.species as string,
  });

  return json({ cheracter });
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const { data } = await getCharacters({
    name: search.get('name')!,
    status: search.get('status')!,
    species: search.get('species')!,
  });

  return json(data);
};

export default function Index() {
  const { info, results } = useLoaderData<Info<Character[]>>();
  console.log('results:', results, 'info:', info);

  return (
    <div className="flex gap-12 flex-col items-center justify-center">
      <Form
        method="get"
        className="flex flex-col gap-6 w-full items-center"
        aria-label="Find charecter"
      >
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name">Charecter name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="p-2 bg-transparent border rounded-lg dark:border-white"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="p-2 bg-transparent border rounded-lg dark:border-white"
          >
            <option value=""></option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">unknown</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="species">Species</label>
          <select
            id="species"
            name="species"
            className="p-2 bg-transparent border rounded-lg dark:border-white"
          >
            <option value="" className="bg-black"></option>
            <option value="human">Human</option>
            <option value="animal">Animal</option>
            <option value="humanoid">Humanoid</option>
            <option value="alien">Alien</option>
            <option value="robot">Robot</option>
            <option value="cronenberg">Cronenberg</option>
            <option value="disease">Disease</option>
            <option value="poopybutthole">Poopybutthole</option>
            <option value="mythological creature">Mythological Creature</option>
            <option value="unknown">unknown</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="episode">Episode</label>
          <input
            id="episode"
            name="episode"
            type="number"
            min="1"
            max="51"
            className="p-2 bg-transparent border rounded-lg dark:border-white"
            autoComplete="off"
          />
        </div>
        <button className="border pl-6 pr-6 pt-2 pb-2" type="submit">
          Find
        </button>
      </Form>

      {results && (
        <ul className="flex flex-col gap-2 w-full">
          <h2 className="text-2xl mb-4">Found</h2>
          {results.map((charecter) => (
            <li
              key={charecter.id}
              className="border rounded p-2 hover:bg-white hover:bg-opacity-10"
            >
              <Link
                to={`/charecters/${charecter.id}`}
                className="flex gap-2"
                title={charecter.name}
              >
                <span>{charecter.name}</span> -
                <span className="text-slate-500">
                  {charecter.species} / {charecter.gender}
                </span>
                <span className={`status status_${charecter.status.toLocaleLowerCase()}`}>
                  {charecter.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

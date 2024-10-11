import { Form, Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Character, getCharacters } from 'rickmortyapi';

export const meta: MetaFunction = () => {
  return [
    { title: 'Rick and Morty Search' },
    { name: 'description', content: 'Find any character from the Rick and Morty universe' },
    { name: 'author', content: 'arty gvozdenkov' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const cheracter = await getCharacters({
    name: updates.name,
  });

  return json({ cheracter });
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const { data } = await getCharacters({ name: search.get('name')! });

  return json(data);
};

export default function Index() {
  const { info, results } = useLoaderData<typeof loader>();
  console.log('data:', results);

  return (
    <div className="flex gap-12 flex-col items-center justify-center">
      <Form className="flex flex-col items-center" aria-label="Find charecter">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Charecter name</label>
          <input
            className="p-2 bg-transparent border-2 dark:border-white"
            id="name"
            name="name"
            type="text"
            autoComplete="off"
          />
        </div>
        <button className="border pl-6 pr-6 pt-2 pb-2" type="submit">
          Find
        </button>
      </Form>

      <ul className="flex flex-col gap-2 w-full">
        {results?.length &&
          results.map((charecter: Character) => (
            <li
              key={charecter.id}
              className="border rounded p-2 hover:bg-white hover:bg-opacity-10"
            >
              <Link to={`/charecters/${charecter.id}`} className="flex gap-2">
                &nbsp; {charecter.name}
              </Link>
            </li>
          ))}
      </ul>
      {/* <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img src="/logo-light.png" alt="Remix" className="block w-full dark:hidden" />
            <img src="/logo-dark.png" alt="Remix" className="hidden w-full dark:block" />
          </div>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">What&apos;s next?</p>
          <ul>
            {resources.map(({ href, text, icon }) => (
              <li key={href}>
                <a
                  className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div> */}
    </div>
  );
}

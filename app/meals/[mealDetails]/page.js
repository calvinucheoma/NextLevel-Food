// localhost:3000/meals/:id   **:id would be anything that is not 'share' as nextjs is smart enough
// to know that 'share' already has its own route in our code.
// Since this is a server component, we do not need to add async to our function name and also
// await the data while it is being fetching since we are already fetching this component from the server.

import Image from 'next/image';
import styles from './page.module.css';
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const meal = getMeal(params.mealDetails);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default function MealDetails({ params }) {
  const meal = getMeal(params.mealDetails);

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, '<br/>'); //looks for line breaks and replace them with the <br/> tag

  return (
    <>
      <header className={styles.header}>
        <div className={styles.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={styles.headerText}>
          <h1>{meal.title}</h1>
          <p className={styles.creator}>
            by <a href={`mailto: ${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={styles.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={styles.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  );
}

import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error('Loading meals failed');
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug); // we use placeholders(?) instead of inserting the values directly as inserting them directly makes them prone to scripting attacks
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true }); //lower:true forces all characters to be lower case.
  meal.instructions = xss(meal.instructions); //to sanitize and clean the meal instructions to prevent against cross side scripting attacks

  const extension = meal.image.name.split('.').pop(); //we split the image file at the dot'.' and pop the last element which would be the file extension since now the image name would be an array with two values, name and .extension
  const uniqueValue = Math.round(Math.random() * 3489); //to make sure we don't accidentally override other images with the same file name
  const fileName = `${meal.slug}${uniqueValue}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`); //creates a stream that allows us to write data to a certain file. The file name to which we want to write must be included in the file path specified inside the bracket.
  const bufferedImage = await meal.image.arrayBuffer(); //arrayBuffer method returns a promise so we add await to it

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Saving image failed!');
    }
  }); //since arrayBuffer is of the type array buffer and write method actually wants a regular buffer, we have to convert it using Buffer.from. The second argument is a function that executes once it's done writing

  meal.image = `/images/${fileName}`; //we do not need to include 'public' here as it is the root level and so to avoid errors in file paths later on

  db.prepare(
    `
    INSERT INTO meals
      (title,summary,instructions,creator,creator_email,image,slug)
    VALUES (        
         @title,
         @summary,
         @instructions,
         @creator,
         @creator_email, 
         @image,
         @slug
        )
  `
  ).run(meal); //our VALUES has to match the order in which we are defining them above
}

// Example queries - modify these according to your schema
export const getAllPosts = `*[_type == "post"] {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  excerpt
}`;

export const getPostBySlug = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  body,
  "categories": categories[]->title
}`;

// Film queries
export const getAllFilms = `*[_type == "film"] {
  _id,
  title,
  category,
  description,
  year,
  client,
  "imageUrl": image.asset->url,
  "videoUrl": videoFile.asset->url
}`;

// Debug query to check if we have any films
export const debugFilms = `*[_type == "film"][0...5] {
  _id,
  _type,
  title
}`;

export const getFilmById = `*[_type == "film" && _id == $id][0] {
  _id,
  title,
  category,
  description,
  year,
  client,
  "imageUrl": image.asset->url,
  "videoUrl": videoFile.asset->url
}`;

export const getFilmsByCategory = `*[_type == "film" && category == $category] {
  _id,
  title,
  category,
  description,
  year,
  client,
  "imageUrl": image.asset->url,
  "videoUrl": videoFile.asset->url
}`;

// Add more queries as needed for your specific content types

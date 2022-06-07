export const makeSlug = async(name = '') => {
  const slug = await name.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .normalize('NFD').replace(/[\u0300-\u036f]/g,"")
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');

  return slug;
}
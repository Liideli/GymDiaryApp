const API_KEY = import.meta.env.VITE_API_KEY;
const doGraphQLFetch = async (
  url: string,
  query: string,
  variables: object,
  token?: string,
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  if (!response.ok) throw new Error(response.statusText);
  const json = await response.json();

  // Check for GraphQL errors
  if (json.errors) {
    throw new Error(json.errors.map((error: { message: string }) => error.message).join(', '));
  }

  return json.data;
};

export { doGraphQLFetch };
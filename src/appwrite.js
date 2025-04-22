import { Client, Databases, ID, Query } from 'appwrite';

const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABSE_ID;

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);
export const updateSearchCount = async(searchTerm, movie)=>{
   // 1. use Appwrite SDK to check if the search term exists in the database
   try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])

        if(result.documents.length > 0){
            // If it exists, update the count
            const doc = result.documents[0];
            // Update the count by incrementing it by 1
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });
        }
        else{
            // If it doesn't exist, create a new document with the search term and count 1
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            });
        }

   } catch (error) {
        console.error('Error updating search count:', error);
   }
   // 2. If it exists, update the count
   // 3. If it doesn't exist, create a new document with the search term and count 1
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc('count'),
        ])

        return result.documents;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        
    }
}
import { Client, Databases, ID, Query } from "appwrite";

const APPWORK_USER_ID = import.meta.env.VITE_APPWORK_USER_ID;
const APPWORK_DATABASE_ID = import.meta.env.VITE_APPWORK_DATABASE_ID;
const APPWORK_COLLECTION_ID = import.meta.env.VITE_APPWORK_COLLECTION_ID;

const client = new Client()
    .setEndpoint("http://cloud.appwrite.io/v1")
    .setProject(APPWORK_USER_ID);

const database = new Databases(client);

export const UpdateSearchedMovie = async (searchTerm, movie) => {
    try{
        const result = await database.listDocuments(APPWORK_DATABASE_ID, APPWORK_COLLECTION_ID, [Query.equal('searchTerm', searchTerm)]);
        if(result.documents.length > 0){
            const doc = result.documents[0];
            await database.updateDocument(APPWORK_DATABASE_ID, APPWORK_COLLECTION_ID, doc.$id, {count: doc.count + 1});
        }else{
            await database.createDocument(APPWORK_DATABASE_ID, APPWORK_COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            })
        }
    }catch(error){
        console.log(error);
    }
    //console.log(`User Id: ${APPWORK_USER_ID}, database id: ${APPWORK_DATABASE_ID}, collection id: ${APPWORK_COLLECTION_ID}`);
}
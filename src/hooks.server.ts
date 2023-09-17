import { LOCAL_POCKETBASE_URL } from '$env/static/private';
import { PUBLIC_DEV } from '$env/static/public';
import PocketBase from 'pocketbase';

export const handle = async ({event, resolve}) => {
    event.locals.authExpired = false;
    event.locals.pb = new PocketBase(LOCAL_POCKETBASE_URL);
    event.locals.pb.authStore.loadFromCookie(
        event.request.headers.get('cookie') || ''
    );
    if(event.locals.pb.authStore.isValid) {
        try{
            await event.locals.pb.collection("users").authRefresh();
        }catch(e){
            event.locals.pb.authStore.clear();
            event.locals.authExpired = true;
            e;
        };
        event.locals.user = event.locals.pb.authStore.model;
    }else{
        event.locals.user = null;
    };

    const response = await resolve(event);

    //TODO: secure before deployment
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie(
        {secure: PUBLIC_DEV != "true"}
    ));

    return response;
}
import PocketBase from 'pocketbase';

export const handle = async ({event, resolve}) => {
    event.locals.pb = new PocketBase('http://localhost:5174');
    event.locals.pb.authStore.loadFromCookie(
        event.request.headers.get('cookie') || ''
    );
        console.log(event.locals.pb.authStore.isValid);
    if(event.locals.pb.authStore.isValid) {
        event.locals.user = event.locals.pb.authStore.model;
    }else{
        event.locals.user = null;
    };

    const response = await resolve(event);

    //TODO: secure before deployment
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie(
        {secure: false}
    ));

    return response;
}
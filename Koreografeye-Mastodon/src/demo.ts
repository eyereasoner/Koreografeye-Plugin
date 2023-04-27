import generator, { Entity, Response } from 'megalodon';

const BASE_URL: string = 'https://openbiblio.social'
const access_token: string = process.env.MASTODON_ACCESS_TOKEN as string;

if (! access_token) {
    console.log('Need an MASTODON_ACCESS_TOKEN as environment variable');
    process.exit(2);
}

const client = generator('mastodon', BASE_URL, access_token);

main();

async function main() {

    if (process.argv.length == 3) {
        const toot : string = process.argv[2];
        await post_toot(toot);
    }
    else {
        await read_timeline();
    }
}

async function read_timeline() {
     client.getHomeTimeline()
     .then((res: Response<Array<Entity.Status>>) => {
         console.log(res.data)
     });
}

async function post_toot(toot:string) {
    client.postStatus(toot, {

    })
        .then((res: Response<Entity.Status | Entity.ScheduledStatus>) => {
        console.log(res);
    });
}
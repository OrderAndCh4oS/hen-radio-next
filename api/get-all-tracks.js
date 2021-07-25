import { gql, request } from 'graphql-request';
import { ipfsUrls } from '../constants';

const query = gql`
    query AudioObjktData {
        hic_et_nunc_token(where: {
            mime: {_in: ["audio/ogg", "audio/wav", "audio/mpeg"]},
            token_holders: {
                quantity: {_gt: "0"},
                holder_id: {_neq: "tz1burnburnburnburnburnburnburjAYjjX"}
            }
        }, order_by: {id: desc}) {
            id
            display_uri
            title
            description
            token_holders {
                holder_id
                quantity
            }
            thumbnail_uri
            mime
            creator_id
            artifact_uri
        }
    }
`;

const getAllTracks = async() => {
    const response = await request('https://api.hicdex.com/v1/graphql', query);
    return response?.hic_et_nunc_token?.map(o => ({
        id: o.id,
        creator: o.creator_id,
        name: o.title,
        src: `${ipfsUrls[~~(Math.random() * ipfsUrls.length)]}/${o.artifact_uri.slice(7)}`,
        mimeType: o.mime,
        displayUri: o.display_uri,
        description: o.description
    })) || [];
};

export default getAllTracks;

import { useEffect } from 'react';
import TrackList from '../track-lists/track-list';
import useRadio from '../../hooks/use-radio';
import useTracksMetadata from '../../hooks/use-metadata';
import { audio } from '../../constants';

const PlaylistTracks = ({playlist}) => {
    const {
        playerState,
        controls,
        isTrackPlaying,
    } = useRadio();

    const {filteredTracks} = playlist;
    const creatorMetadata = useTracksMetadata(filteredTracks);


    if(audio) {
        audio.onended = () => {
            if(!filteredTracks.length) return;
            const nextTrackKey = (playerState.currentTrackKey + 1) % tracks.length;
            controls.selectTrack(filteredTracks)(nextTrackKey)();
        };
    }

    useEffect(() => {
        if(!filteredTracks?.length || !audio) return;
        if(audio.src) return;
        controls.initialiseTrack(filteredTracks)(0)();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredTracks]);

    if(!filteredTracks) return <p>Loading...</p>;

    return (
        <TrackList
            tracks={filteredTracks}
            isTrackPlaying={isTrackPlaying}
            creatorMetadata={creatorMetadata}
            playlist={playlist}
        />
    );
};

export default PlaylistTracks;

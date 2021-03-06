import UserPlaylistProvider from '../../context/user-playlists-context';
import RadioProvider from '../../context/radio-context';
import WalletProvider from '../../context/wallet-context';
import PlaylistProvider from '../../context/playlist-context';
import Layout from './layout';
import styles from './styles.module.css';
import RadioPlayer from '../radio-player/radio-player';
import TrackProvider from '../../context/track-context';

const Providers = ({children}) =>
    <WalletProvider>
        <TrackProvider>
            <RadioProvider>
                <UserPlaylistProvider>
                    <PlaylistProvider>
                        <Layout>
                            <div className={styles.radioPlayerBar}>
                                <RadioPlayer/>
                            </div>
                            {children}
                        </Layout>
                    </PlaylistProvider>
                </UserPlaylistProvider>
            </RadioProvider>
        </TrackProvider>
    </WalletProvider>
;

export default Providers;

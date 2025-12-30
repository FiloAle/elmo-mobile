import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface HistoryTripCardProps {
    date: { month: string; day: string };
    city: string;
    distance: string;
    images: string[];
    trackImage: string | number;
    friends: string[];
}

// Removed showDate and isFirst props as date handling is moved to parent
export default function HistoryTripCard({ city, distance, images, trackImage, friends }: HistoryTripCardProps) {
    const trackImageSource = typeof trackImage === 'string' ? { uri: trackImage } : trackImage;

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.contentContainer}>
                <View style={styles.cardsRow}>
                    {/* Map Snippet */}
                    <View style={[styles.cardBox, styles.mapBox]}>
                        <Image source={trackImageSource} style={styles.imageFill} contentFit="cover" />
                        <View style={styles.overlay} />
                    </View>

                    {/* Photo Gallery Stack */}
                    <View style={styles.photoStackContainer}>
                        {/* We use a fixed set of dummy rotations for visual stability */}
                        {images.slice(0, 3).map((img, index) => {
                            const rotations = ['-6deg', '2deg', '8deg'];
                            const xOffsets = [0, 15, 30]; // Horizontal stacking shift
                            const yOffsets = [0, 5, -2]; // Slight vertical jiggle

                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.stackedPhoto,
                                        {
                                            zIndex: index,
                                            transform: [{ rotate: rotations[index % 3] }],
                                            left: xOffsets[index % 3] + 10, // Base padding + shift
                                            top: yOffsets[index % 3] + 10,
                                        }
                                    ]}
                                >
                                    <Image source={{ uri: img }} style={styles.imageFill} contentFit="cover" />
                                    {/* Overlay for the last visible item to show count if there are more */}
                                    {index === 2 && images.length > 3 && (
                                        <View style={styles.photoOverlay}>
                                            <Text style={styles.photoCountText}>+{images.length - 3}</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Footer Row */}
                <View style={styles.footerRow}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-sharp" size={16} color={Colors.elmo.accent} />
                        <Text style={styles.cityText}>{city}</Text>
                        <Text style={styles.distanceText}>{distance}</Text>
                    </View>

                    {/* Friend Avatars */}
                    <View style={styles.avatarsContainer}>
                        {friends.slice(0, 3).map((friend, index) => (
                            <View key={index} style={[styles.avatarCircle, { zIndex: 3 - index, marginLeft: index === 0 ? 0 : -10 }]}>
                                <Image source={{ uri: friend }} style={styles.avatarImage} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 12, // Increased gap slightly
        marginBottom: 16,
        height: 160, // Fixed height for the row to accommodate rotation
    },
    cardBox: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.elmo.cardDark,
        height: '100%',
    },
    mapBox: {
        flex: 1.2, // Give map slightly more space
    },
    photoStackContainer: {
        flex: 1,
        position: 'relative',
        // justifyContent: 'center', // Align roughly
    },
    stackedPhoto: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: Colors.elmo.background, // #051616
        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: '#222',
    },
    imageFill: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    photoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoCountText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cityText: {
        color: Colors.elmo.text,
        fontSize: 16,
        fontWeight: '600',
    },
    distanceText: {
        color: Colors.elmo.textSecondary,
        fontSize: 14,
    },
    avatarsContainer: {
        flexDirection: 'row',
    },
    avatarCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.elmo.background,
        overflow: 'hidden',
        backgroundColor: '#ccc',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    }
});

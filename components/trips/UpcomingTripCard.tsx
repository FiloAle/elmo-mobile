
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface UpcomingTripCardProps {
    date: { month: string; day: string };
    city: string;
    daysLeft: number;
    time: string;
    distance: string;
    image: string;
    friends: string[];
    highlighted?: boolean;
}

export default function UpcomingTripCard({ date, city, daysLeft, time, distance, image, friends, highlighted }: UpcomingTripCardProps) {
    return (
        <View style={[styles.container, highlighted && styles.containerSquare]}>
            {/* Date Column - Consistent with History */}
            <View style={styles.dateColumn}>
                <Text style={styles.monthText}>{date.month}</Text>
                <View style={styles.dayCircle}>
                    <Text style={styles.dayText}>{date.day}</Text>
                </View>
                <View style={[styles.line, highlighted && { opacity: 0 }]} />
                {/* Hide line if square/highlighted? Or keep it? The prompt says "The #2DD4BF stroke should wrap around this square container." 
                    The container includes the date column currently.
                    "Each trip "group" starts with the date label... content grid... remove left date column" - Wait, that was the previous request (History).
                    Current prompt for Upcoming: "The #2DD4BF stroke should wrap around this square container." implied the CARD is the square.
                    The current implementation has date column OUTSIDE the card style (styles.card).
                    If the stroke wraps the "square container", and "Upcoming" card is a perfect square...
                    Let's assume the "Card" part (right side) is the square, OR the whole thing.
                    Given "Upcoming Section... Date indicator: On the far left of each card", the date is part of the visual row.
                    However, usually "Card" refers to the box. 
                    If I make the *internal* card square, the date column stays on left.
                    The prompt says: "Ensure the 'Upcoming' card is also a perfect square... The #2DD4BF stroke should wrap around this square container."
                    I will apply the stroke to the `styles.card` view and make THAT square.
                */}
            </View>

            {/* Card Content */}
            <View style={[
                styles.card,
                highlighted && styles.cardHighlighted
            ]}>
                {/* Left Side: Destination Image */}
                <Image source={{ uri: image }} style={styles.image} contentFit="cover" />

                {/* Right Side: Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.locationHeader}>
                        <Ionicons name="location-sharp" size={18} color={Colors.elmo.accent} />
                        <Text style={styles.cityText}>{city}</Text>
                    </View>

                    <View style={styles.avatarsContainer}>
                        {friends.slice(0, 4).map((friend, index) => (
                            <View key={index} style={[styles.avatarCircle, { zIndex: 4 - index, marginLeft: index === 0 ? 0 : -8 }]}>
                                <Image source={{ uri: friend }} style={styles.avatarImage} />
                            </View>
                        ))}
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>{daysLeft} Days Left</Text>
                    </View>
                    <View style={styles.secondaryInfoRow}>
                        <Text style={styles.subInfoText}>Time ({time})</Text>
                        <Text style={styles.subInfoText}>•</Text>
                        <Text style={styles.subInfoText}>Distance ({distance})</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        height: 160,
    },
    containerSquare: {
        // If the inner card is square, the container height might need to be dynamic or large enough.
        // We let the card determine the height.
        height: 'auto',
        aspectRatio: 'auto', // Container isn't the square, the card is.
    },
    dateColumn: {
        alignItems: 'center',
        marginRight: 15,
        width: 40,
    },
    monthText: {
        color: Colors.elmo.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    line: {
        width: 1,
        flex: 1,
        backgroundColor: Colors.elmo.textSecondary,
        opacity: 0.3,
        marginTop: 8,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.elmo.cardDark,
        borderRadius: 20,
        overflow: 'hidden',
        padding: 10,
    },
    cardHighlighted: {
        aspectRatio: 1, // Make the card square
        // Shadow/Glow
        shadowColor: '#2DD4BF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 10, // Android
    },
    image: {
        width: 100,
        height: '100%',
        borderRadius: 15,
        backgroundColor: '#333',
    },
    detailsContainer: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'center',
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    cityText: {
        color: Colors.elmo.accent,
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatarsContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    avatarCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1.5,
        borderColor: Colors.elmo.cardDark,
        overflow: 'hidden',
        backgroundColor: '#ccc',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    infoRow: {
        marginBottom: 4,
    },
    infoText: {
        color: Colors.elmo.text,
        fontWeight: '600',
        fontSize: 14,
    },
    secondaryInfoRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    subInfoText: {
        color: Colors.elmo.textSecondary,
        fontSize: 10,
    },
});

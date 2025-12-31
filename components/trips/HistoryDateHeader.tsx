import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface HistoryDateHeaderProps {
    date: { month: string; day: string };
    isFirst?: boolean;
}

export default function HistoryDateHeader({ date, isFirst }: HistoryDateHeaderProps) {
    return (
        <View style={[styles.headerContainer, isFirst && styles.firstHeader]}>
            <Text style={styles.dateText}>
                {date.day} {date.month} 2025
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'transparent', // Fully transparent
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        marginBottom: 16,
        marginTop: 24,
        zIndex: 10, // Layer 3 (Top of Cards and Gradient)
    },
    firstHeader: {
        paddingTop: 10, // Minimal padding for first item
    },
    dateText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },
});

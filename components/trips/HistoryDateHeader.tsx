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
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        zIndex: 10, // Layer 3 (Top of Cards and Gradient)
    },
    firstHeader: {
        paddingTop: 0, // Minimal padding for first item
    },
    dateText: {
        color: '#fff',
        fontWeight: 'regular',
        fontSize: 13,
        textTransform: 'uppercase',
    },
});

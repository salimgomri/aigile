'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#07111f',
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#c9973a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#07111f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c9973a',
  },
  date: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c9973a',
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#0f2240',
    borderRadius: 4,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#e2e8f0',
  },
  metricValue: {
    fontSize: 12,
    color: '#c9973a',
    fontWeight: 'bold',
  },
  recommendations: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 1.5,
    marginTop: 8,
  },
})

interface DoraPdfProps {
  date: string
  deployFreq: number
  leadTimeHours: number
  cfrPct: number
  mttrHours: number
  ragResult: { deployFreq: { rank: string }; leadTime: { rank: string }; cfr: { rank: string }; mttr: { rank: string } }
  recommendations?: string
}

export function DoraPdfDocument({
  date,
  deployFreq,
  leadTimeHours,
  cfrPct,
  mttrHours,
  ragResult,
  recommendations,
}: DoraPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.title}>AIgile - Métriques DORA</Text>
        </View>
        <Text style={styles.date}>{date}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métriques & Niveau RAG</Text>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Deployment Frequency</Text>
            <Text style={styles.metricValue}>{deployFreq} / semaine — {ragResult.deployFreq.rank.toUpperCase()}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Lead Time</Text>
            <Text style={styles.metricValue}>{leadTimeHours}h — {ragResult.leadTime.rank.toUpperCase()}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>CFR (Change Failure Rate)</Text>
            <Text style={styles.metricValue}>{cfrPct}% — {ragResult.cfr.rank.toUpperCase()}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>MTTR (Mean Time To Recovery)</Text>
            <Text style={styles.metricValue}>{mttrHours}h — {ragResult.mttr.rank.toUpperCase()}</Text>
          </View>
        </View>

        {recommendations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommandations IA</Text>
            <Text style={styles.recommendations}>{recommendations}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

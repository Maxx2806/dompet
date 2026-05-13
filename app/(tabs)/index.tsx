import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

// 1. Menambahkan Interface agar TypeScript tidak menganggap tipe data sebagai 'never' [1]
interface Transaksi {
  id: string;
  ket: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

export default function App() {
  // 2. Memberikan tipe data explicit <Transaksi[]> pada useState [3][1]
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [nominal, setNominal] = useState<string>('');

  // 3. Logika Hitung Total Saldo (Masuk tambah, Keluar kurang) [3]
  const totalSaldo = transaksi.reduce((acc, curr) => {
    return curr.tipe === 'masuk' ? acc + curr.nominal : acc - curr.nominal;
  }, 0);

  // 4. Fungsi Tambah Data dengan pengetikan parameter 'tipe' [1]
  const tambahData = (tipe: 'masuk' | 'keluar') => {
    if (!deskripsi.trim() || !nominal.trim()) {
      Alert.alert("Error", "Deskripsi dan Nominal harus diisi!");
      return;
    }

    const nilaiNominal = parseInt(nominal);
    if (isNaN(nilaiNominal)) {
      Alert.alert("Error", "Nominal harus berupa angka!");
      return;
    }

    // Object baru sesuai Clue Logika State [3]
    const dataBaru: Transaksi = {
      id: Date.now().toString(),
      ket: deskripsi, 
      nominal: nilaiNominal,
      tipe: tipe,
    };

    setTransaksi([dataBaru, ...transaksi]);
    setDeskripsi('');
    setNominal('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Saldo [2] */}
      <View style={styles.headerSaldo}>
        <Text style={styles.labelSaldo}>Total Saldo Saat Ini:</Text>
        <Text style={styles.angkaSaldo}>Rp {totalSaldo.toLocaleString()}</Text>
      </View>

      {/* Form Input Transaksi [2] */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Deskripsi (Contoh: Jajan)"
          value={deskripsi}
          onChangeText={setDeskripsi}
        />
        <TextInput
          style={styles.input}
          placeholder="Nominal (Contoh: 20000)"
          value={nominal}
          keyboardType="numeric"
          onChangeText={setNominal}
        />
        
        <View style={styles.rowTombol}>
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#2ecc71' }]} 
            onPress={() => tambahData('masuk')}
          >
            <Text style={styles.btnText}>Pemasukan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#e74c3c' }]} 
            onPress={() => tambahData('keluar')}
          >
            <Text style={styles.btnText}>Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List History menggunakan FlatList [2] */}
      <View style={{ flex: 1 }}>
        <Text style={styles.titleHistory}>Riwayat Transaksi</Text>
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardHistory}>
              <Text style={styles.txtKet}>{item.ket}</Text>
              {/* Styling Warna: Hijau jika Masuk, Merah jika Keluar [2] */}
              <Text style={[
                styles.txtNominal, 
                { color: item.tipe === 'masuk' ? '#2ecc71' : '#e74c3c' }
              ]}>
                {item.tipe === 'masuk' ? '+' : '-'} Rp {item.nominal.toLocaleString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.txtEmpty}>Belum ada transaksi, Bro!</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', paddingHorizontal: 20 },
  headerSaldo: { 
    marginTop: 30, 
    padding: 25, 
    backgroundColor: '#2f3640', 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  labelSaldo: { color: '#dcdde1', fontSize: 14 },
  angkaSaldo: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  formContainer: { marginVertical: 20 },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#dcdde1', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  rowTombol: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 15, borderRadius: 10, marginHorizontal: 5, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  titleHistory: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  cardHistory: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 10 
  },
  txtKet: { fontSize: 16 },
  txtNominal: { fontSize: 16, fontWeight: 'bold' },
  txtEmpty: { textAlign: 'center', marginTop: 30, color: '#7f8c8d' }
});
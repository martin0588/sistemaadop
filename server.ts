import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

let pool: mysql.Pool | null = null;
let useMock = false;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// --- MOCK DATA FOR AI STUDIO PREVIEW ---
let mockUsers: any[] = [
  { id: 1, username: 'admin', password: '123', role: 'Administrador', full_name: 'Admin Principal', email: 'admin@huellitas.com', profile_pic: 'https://ui-avatars.com/api/?name=Admin+Principal&background=f59e0b&color=fff' },
  { id: 2, username: 'vet', password: '123', role: 'Veterinario', full_name: 'Dr. Vet', email: 'vet@huellitas.com', profile_pic: 'https://ui-avatars.com/api/?name=Dr+Vet&background=14b8a6&color=fff' },
  { id: 3, username: 'vol', password: '123', role: 'Voluntario', full_name: 'Voluntario 1', email: 'vol@huellitas.com', profile_pic: 'https://ui-avatars.com/api/?name=Voluntario+1&background=8b5cf6&color=fff' },
  { id: 4, username: 'adopt', password: '123', role: 'Adoptante', full_name: 'Juan Perez', email: 'juan@gmail.com', profile_pic: 'https://ui-avatars.com/api/?name=Juan+Perez&background=f43f5e&color=fff' }
];
let mockPets = [
  { id: 1, name: 'Luna', species: 'Perro', breed: 'Golden Retriever', age: 2, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Sana, vacunas al día. Muy juguetona y cariñosa.' },
  { id: 2, name: 'Milo', species: 'Gato', breed: 'Mestizo', age: 1, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Desparasitado. Le encanta dormir al sol.' },
  { id: 3, name: 'Bella', species: 'Perro', breed: 'Pug', age: 3, status: 'En Tratamiento', image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'En tratamiento por alergia en la piel. Requiere dieta especial.' },
  { id: 4, name: 'Simba', species: 'Gato', breed: 'Persa', age: 4, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Tranquilo y muy peludo. Necesita cepillado diario.' },
  { id: 5, name: 'Rocky', species: 'Perro', breed: 'Bulldog Francés', age: 2, status: 'Adoptado', image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Saludable. Adoptado por la familia Perez.' },
  { id: 6, name: 'Nala', species: 'Gato', breed: 'Siamés', age: 1, status: 'En Proceso', image_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Muy vocal y activa. Esperando confirmación de adopción.' },
  { id: 7, name: 'Max', species: 'Perro', breed: 'Pastor Alemán', age: 5, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Entrenado y obediente. Ideal para espacios grandes.' },
  { id: 8, name: 'Coco', species: 'Conejo', breed: 'Enano', age: 1, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1585110396000-c9fd4e4e325c?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Saludable. Come mucho heno.' },
  { id: 9, name: 'Kira', species: 'Perro', breed: 'Husky Siberiano', age: 2, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1605568420105-440fa10f1e54?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Mucha energía. Necesita ejercicio diario.' },
  { id: 10, name: 'Oliver', species: 'Gato', breed: 'Mestizo', age: 2, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Rescatado de la calle. Un poco tímido pero amoroso.' },
  { id: 11, name: 'Toby', species: 'Perro', breed: 'Beagle', age: 3, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1537151608804-ea6f11840eb3?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Excelente olfato, muy curioso.' },
  { id: 12, name: 'Mia', species: 'Gato', breed: 'Angora', age: 2, status: 'En Tratamiento', image_url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Recuperándose de una infección ocular.' },
  { id: 13, name: 'Zeus', species: 'Perro', breed: 'Doberman', age: 4, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Protector y leal. Requiere dueño con experiencia.' },
  { id: 14, name: 'Chloe', species: 'Gato', breed: 'Mestizo', age: 1, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Muy juguetona, le encantan los ratones de juguete.' },
  { id: 15, name: 'Bruno', species: 'Perro', breed: 'Labrador', age: 6, status: 'Disponible', image_url: 'https://images.unsplash.com/photo-1599561046222-a4eb0bc882f9?auto=format&fit=crop&q=80&w=600&h=400', vet_notes: 'Perro mayor, muy tranquilo y amoroso.' }
];
let mockAdoptions: any[] = [
  { id: 1, pet_id: 5, user_id: 4, status: 'Aprobado', request_date: new Date().toISOString() },
  { id: 2, pet_id: 6, user_id: 4, status: 'Pendiente', request_date: new Date().toISOString() }
];
let mockNotifications: any[] = [
  { id: 1, title: 'Bienvenido', message: 'Gracias por unirte a Huellitas Bolivia.', date: new Date().toISOString() }
];
let mockMedicalRecords: any[] = [
  { id: 1, pet_id: 3, vet_id: 2, date: new Date().toISOString(), description: 'Revisión por alergia en la piel', treatment: 'Crema tópica y dieta especial' }
];
let mockFollowUps: any[] = [
  { id: 1, adoption_id: 1, date: new Date().toISOString(), notes: 'La familia envió fotos, el perrito se adaptó excelente.', status: 'Excelente' }
];

let nextUserId = 5;
let nextPetId = 16;
let nextAdoptionId = 3;
let nextNotifId = 2;
let nextMedId = 2;
let nextFollowId = 2;

async function initDB() {
  try {
    const connection = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  port: 3307
});
    await connection.query('CREATE DATABASE IF NOT EXISTS huellitas_bolivia');
    await connection.end();

    pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'huellitas_bolivia',
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

    await pool.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(50), full_name VARCHAR(255), email VARCHAR(255), profile_pic TEXT)`);
    
    // Intentar añadir la columna si la tabla ya existía de antes
    try { await pool.query('ALTER TABLE users ADD COLUMN profile_pic TEXT'); } catch (e) {}
    try { await pool.query('ALTER TABLE users ADD COLUMN email_verified TINYINT DEFAULT 1'); } catch (e) {}
    try { await pool.query('ALTER TABLE users ADD COLUMN verification_code VARCHAR(10)'); } catch (e) {}
    try { await pool.query('ALTER TABLE users ADD COLUMN verification_expires DATETIME'); } catch (e) {}

    await pool.query(`CREATE TABLE IF NOT EXISTS pets (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), species VARCHAR(100), breed VARCHAR(100), age INT, status VARCHAR(50), image_url TEXT, vet_notes TEXT)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS adoptions (id INT AUTO_INCREMENT PRIMARY KEY, pet_id INT, user_id INT, status VARCHAR(50), request_date DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (pet_id) REFERENCES pets(id), FOREIGN KEY (user_id) REFERENCES users(id))`);

    await pool.query(`CREATE TABLE IF NOT EXISTS notifications (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), message TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS medical_records (id INT AUTO_INCREMENT PRIMARY KEY, pet_id INT, vet_id INT, date DATETIME DEFAULT CURRENT_TIMESTAMP, description TEXT, treatment TEXT, FOREIGN KEY (pet_id) REFERENCES pets(id), FOREIGN KEY (vet_id) REFERENCES users(id))`);
    await pool.query(`CREATE TABLE IF NOT EXISTS adoption_followups (id INT AUTO_INCREMENT PRIMARY KEY, adoption_id INT, date DATETIME DEFAULT CURRENT_TIMESTAMP, notes TEXT, status VARCHAR(50), FOREIGN KEY (adoption_id) REFERENCES adoptions(id))`);

    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    if ((rows as any)[0].count === 0) {
      await pool.query('INSERT INTO users (username, password, role, full_name, email, profile_pic) VALUES ?', [mockUsers.map(u => [u.username, u.password, u.role, u.full_name, u.email, u.profile_pic])]);
      await pool.query('INSERT INTO pets (name, species, breed, age, status, image_url, vet_notes) VALUES ?', [mockPets.map(p => [p.name, p.species, p.breed, p.age, p.status, p.image_url, p.vet_notes])]);
    }
    console.log("Base de datos MySQL inicializada correctamente.");
  } catch (error) {
    console.log("MySQL no detectado.");
    useMock = true;
  }
}

// --- API ROUTES ---

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (useMock) {
    const user = mockUsers.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    if (user.email_verified === 0) {
      return res.status(403).json({
        success: false,
        needsVerification: true,
        email: user.email,
        message: 'Debes verificar tu correo antes de iniciar sesión',
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
        profile_pic: user.profile_pic,
      },
    });
  }

  try {
    const [rows] = await pool!.execute(
      'SELECT id, username, role, full_name, email, profile_pic, email_verified FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    const users = rows as any[];

    if (users.length > 0 && users[0].email_verified === 0) {
      return res.status(403).json({
        success: false,
        needsVerification: true,
        email: users[0].email,
        message: 'Debes verificar tu correo antes de iniciar sesión',
      });
    }

    if (users.length > 0) {
      return res.json({ success: true, user: users[0] });
    }

    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas',
    });
  } catch (e) {
    console.error('Error en login:', e);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
});

app.post('/api/register', async (req, res) => {
  const { full_name, email, username, password } = req.body;
  const profile_pic = `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=f43f5e&color=fff`;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 1000 * 60 * 10);

  if (useMock) {
    if (mockUsers.find(u => u.username === username)) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe',
      });
    }

    const newUser = {
      id: nextUserId++,
      username,
      password,
      role: 'Adoptante',
      full_name,
      email,
      profile_pic,
      email_verified: 0,
      verification_code: verificationCode,
      verification_expires: expires,
    };

    mockUsers.push(newUser);

    return res.json({
      success: true,
      needsVerification: true,
      email,
      message: 'Registro exitoso. Verifica tu correo.',
    });
  }

  try {
    const [result] = await pool!.execute(
      `INSERT INTO users
      (username, password, role, full_name, email, profile_pic, email_verified, verification_code, verification_expires)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        password,
        'Adoptante',
        full_name,
        email,
        profile_pic,
        0,
        verificationCode,
        expires,
      ]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de verificación - Huellitas Bolivia',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color:#d97706;">Huellitas Bolivia</h2>
          <p>Hola ${full_name},</p>
          <p>Tu código de verificación es:</p>
          <h1 style="letter-spacing: 6px; background:#fef3c7; padding:16px; border-radius:12px; display:inline-block;">${verificationCode}</h1>
          <p>Este código expira en 10 minutos.</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      needsVerification: true,
      email,
      userId: (result as any).insertId,
      message: 'Registro exitoso. Revisa tu correo.',
    });
  } catch (e: any) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe',
      });
    }

    console.error('Error en registro:', e);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
});

app.post('/api/verify-email', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: 'Correo y código son requeridos',
    });
  }

  if (useMock) {
    const user = mockUsers.find(u => u.email === email && u.verification_code === code);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Código incorrecto',
      });
    }

    if (new Date(user.verification_expires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'El código expiró',
      });
    }

    user.email_verified = 1;
    user.verification_code = null;
    user.verification_expires = null;

    return res.json({
      success: true,
      message: 'Correo verificado correctamente',
    });
  }

  try {
    const [rows] = await pool!.execute(
      `SELECT id, verification_expires
       FROM users
       WHERE email = ? AND verification_code = ?`,
      [email, code]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Código incorrecto',
      });
    }

    const selectedUser = users[0];

    if (new Date(selectedUser.verification_expires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'El código expiró',
      });
    }

    await pool!.execute(
      `UPDATE users
       SET email_verified = 1, verification_code = NULL, verification_expires = NULL
       WHERE id = ?`,
      [selectedUser.id]
    );

    return res.json({
      success: true,
      message: 'Correo verificado correctamente',
    });
  } catch (e) {
    console.error('Error al verificar correo:', e);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { full_name, email, profile_pic } = req.body;
  const id = parseInt(req.params.id);
  if (useMock) {
    const user = mockUsers.find(u => u.id === id);
    if (user) {
      user.full_name = full_name; user.email = email; user.profile_pic = profile_pic;
      return res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name, email: user.email, profile_pic: user.profile_pic } });
    }
    return res.status(404).json({ success: false });
  }
  try {
    await pool!.execute('UPDATE users SET full_name = ?, email = ?, profile_pic = ? WHERE id = ?', [full_name, email, profile_pic, id]);
    const [rows] = await pool!.execute('SELECT id, username, role, full_name, email, profile_pic, email_verified FROM users WHERE id = ?', [id]);
    res.json({ success: true, user: (rows as any[])[0] });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.get('/api/users', async (req, res) => {
  if (useMock) return res.json(mockUsers.map(u => ({ id: u.id, username: u.username, role: u.role, full_name: u.full_name, email: u.email, profile_pic: u.profile_pic })));
  try {
    const [rows] = await pool!.query('SELECT id, username, role, full_name, email, profile_pic, email_verified FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.get('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (useMock) {
    const user = mockUsers.find(u => u.id === id);
    if (user) return res.json({ id: user.id, username: user.username, role: user.role, full_name: user.full_name, email: user.email, profile_pic: user.profile_pic });
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
  try {
    const [rows] = await pool!.query('SELECT id, username, role, full_name, email, profile_pic, email_verified FROM users WHERE id = ?', [id]) as any;
    if (rows.length > 0) return res.json(rows[0]);
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.delete('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (useMock) {
    mockUsers = mockUsers.filter(u => u.id !== id);
    return res.json({ success: true });
  }
  try {
    await pool!.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.put('/api/users/:id/role', async (req, res) => {
  const { role } = req.body;
  const id = parseInt(req.params.id);
  if (useMock) {
    const user = mockUsers.find(u => u.id === id);
    if (user) user.role = role;
    return res.json({ success: true });
  }
  try {
    await pool!.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.put('/api/users/:id/reset-password', async (req, res) => {
  const id = parseInt(req.params.id);

  const temporaryPassword = '123';

  if (useMock) {
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    user.password = temporaryPassword;

    return res.json({
      success: true,
      temporaryPassword,
    });
  }

  try {
    await pool!.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [temporaryPassword, id]
    );

    res.json({
      success: true,
      temporaryPassword,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
});

app.get('/api/pets', async (req, res) => {
  if (useMock) return res.json(mockPets);
  try {
    const [rows] = await pool!.query('SELECT * FROM pets ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.post('/api/pets', async (req, res) => {
  const { name, species, breed, age, image_url } = req.body;
  const img = image_url || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600&h=400`;
  if (useMock) {
    const newPet = { id: nextPetId++, name, species, breed, age: parseInt(age), status: 'Disponible', image_url: img, vet_notes: 'Sin notas aún.' };
    mockPets.unshift(newPet);
    return res.json({ success: true, id: newPet.id });
  }
  try {
    const [result] = await pool!.execute(
      'INSERT INTO pets (name, species, breed, age, status, image_url, vet_notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, species, breed, age, 'Disponible', img, 'Sin notas aún.']
    );
    res.json({ success: true, id: (result as any).insertId });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.put('/api/pets/:id', async (req, res) => {
  const { name, species, breed, age, image_url } = req.body;
  const id = parseInt(req.params.id);
  if (useMock) {
    const idx = mockPets.findIndex(p => p.id === id);
    if (idx > -1) {
      mockPets[idx] = { ...mockPets[idx], name, species, breed, age: parseInt(age), image_url };
      return res.json({ success: true });
    }
    return res.status(404).json({ success: false });
  }
  try {
    await pool!.execute('UPDATE pets SET name = ?, species = ?, breed = ?, age = ?, image_url = ? WHERE id = ?', [name, species, breed, age, image_url, id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.put('/api/pets/:id/status', async (req, res) => {
  const { status } = req.body;
  const id = parseInt(req.params.id);
  if (useMock) {
    const pet = mockPets.find(p => p.id === id);
    if (pet) pet.status = status;
    return res.json({ success: true });
  }
  try {
    await pool!.execute('UPDATE pets SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.put('/api/pets/:id/notes', async (req, res) => {
  const { vet_notes } = req.body;
  const id = parseInt(req.params.id);
  if (useMock) {
    const pet = mockPets.find(p => p.id === id);
    if (pet) pet.vet_notes = vet_notes;
    return res.json({ success: true });
  }
  try {
    await pool!.execute('UPDATE pets SET vet_notes = ? WHERE id = ?', [vet_notes, id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

// Adoptions
app.get('/api/adoptions', async (req, res) => {
  if (useMock) {
    const enriched = mockAdoptions.map(a => {
      const pet = mockPets.find(p => p.id === a.pet_id);
      const user = mockUsers.find(u => u.id === a.user_id);
      return { ...a, pet_name: pet?.name, user_name: user?.full_name };
    });
    return res.json(enriched);
  }
  try {
    const [rows] = await pool!.query(`
      SELECT a.*, p.name as pet_name, u.full_name as user_name 
      FROM adoptions a 
      JOIN pets p ON a.pet_id = p.id 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.id DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.post('/api/adoptions', async (req, res) => {
  const { pet_id, user_id } = req.body;
  if (useMock) {
    mockAdoptions.push({ id: nextAdoptionId++, pet_id, user_id, status: 'Pendiente', request_date: new Date().toISOString() });
    const pet = mockPets.find(p => p.id === pet_id);
    if (pet) pet.status = 'En Proceso';
    return res.json({ success: true });
  }
  try {
    await pool!.execute('INSERT INTO adoptions (pet_id, user_id, status) VALUES (?, ?, ?)', [pet_id, user_id, 'Pendiente']);
    await pool!.execute('UPDATE pets SET status = ? WHERE id = ?', ['En Proceso', pet_id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.put('/api/adoptions/:id/status', async (req, res) => {
  const { status, pet_id } = req.body; // status: 'Aprobado' | 'Rechazado'
  const id = parseInt(req.params.id);
  if (useMock) {
    const ad = mockAdoptions.find(a => a.id === id);
    if (ad) ad.status = status;
    const pet = mockPets.find(p => p.id === pet_id);
    if (pet) pet.status = status === 'Aprobado' ? 'Adoptado' : 'Disponible';
    return res.json({ success: true });
  }
  try {
    await pool!.execute('UPDATE adoptions SET status = ? WHERE id = ?', [status, id]);
    const petStatus = status === 'Aprobado' ? 'Adoptado' : 'Disponible';
    await pool!.execute('UPDATE pets SET status = ? WHERE id = ?', [petStatus, pet_id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.get('/api/stats', async (req, res) => {
  if (useMock) {
    return res.json({
      totalPets: mockPets.length,
      adoptedPets: mockPets.filter(p => p.status === 'Adoptado').length,
      pendingAdoptions: mockAdoptions.filter(a => a.status === 'Pendiente').length,
      totalUsers: mockUsers.length,
      treatmentPets: mockPets.filter(p => p.status === 'En Tratamiento').length
    });
  }
  try {
    const [pets] = await pool!.query('SELECT COUNT(*) as c FROM pets') as any;
    const [adopted] = await pool!.query('SELECT COUNT(*) as c FROM pets WHERE status="Adoptado"') as any;
    const [pending] = await pool!.query('SELECT COUNT(*) as c FROM adoptions WHERE status="Pendiente"') as any;
    const [users] = await pool!.query('SELECT COUNT(*) as c FROM users') as any;
    const [treatment] = await pool!.query('SELECT COUNT(*) as c FROM pets WHERE status="En Tratamiento"') as any;
    res.json({
      totalPets: pets[0].c, adoptedPets: adopted[0].c, pendingAdoptions: pending[0].c, totalUsers: users[0].c, treatmentPets: treatment[0].c
    });
  } catch (e) { res.status(500).json({ success: false }); }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
  if (useMock) {
    return res.json(mockNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }
  try {
    const [rows] = await pool!.query('SELECT * FROM notifications ORDER BY date DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});
app.post('/api/notifications', async (req, res) => {
  const { title, message } = req.body;
  if (useMock) {
    const n = { id: nextNotifId++, title, message, date: new Date().toISOString() };
    mockNotifications.push(n);
    return res.json({ success: true, notification: n });
  }
  try {
    const [result] = await pool!.execute('INSERT INTO notifications (title, message) VALUES (?, ?)', [title, message]);
    res.json({ success: true, notification: { id: (result as any).insertId, title, message, date: new Date().toISOString() } });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

app.delete('/api/notifications/:id', async (req, res) => {
  const { id } = req.params;
  if (useMock) {
    const index = mockNotifications.findIndex(n => n.id === parseInt(id));
    if (index > -1) mockNotifications.splice(index, 1);
    return res.json({ success: true });
  }
  try {
    await pool!.execute('DELETE FROM notifications WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

// Medical Records
app.get('/api/pets/:id/medical', async (req, res) => {
  const id = parseInt(req.params.id);
  if (useMock) {
    return res.json(mockMedicalRecords.filter(m => m.pet_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }
  try {
    const [rows] = await pool!.query('SELECT * FROM medical_records WHERE pet_id = ? ORDER BY date DESC', [id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});
app.post('/api/pets/:id/medical', async (req, res) => {
  const { vet_id, description, treatment } = req.body;
  const id = parseInt(req.params.id);
  if (useMock) {
    const m = { id: nextMedId++, pet_id: id, vet_id, description, treatment, date: new Date().toISOString() };
    mockMedicalRecords.push(m);
    return res.json({ success: true, record: m });
  }
  try {
    const [result] = await pool!.execute('INSERT INTO medical_records (pet_id, vet_id, description, treatment) VALUES (?, ?, ?, ?)', [id, vet_id, description, treatment]);
    res.json({ success: true, record: { id: (result as any).insertId, pet_id: id, vet_id, description, treatment, date: new Date().toISOString() } });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

// Adoption Follow-ups
app.get('/api/adoptions/:id/followups', async (req, res) => {
  const id = parseInt(req.params.id);
  if (useMock) {
    return res.json(mockFollowUps.filter(f => f.adoption_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }
  try {
    const [rows] = await pool!.query('SELECT * FROM adoption_followups WHERE adoption_id = ? ORDER BY date DESC', [id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});
app.post('/api/adoptions/:id/followups', async (req, res) => {
  const { notes, status } = req.body;
  const id = parseInt(req.params.id);
  if (useMock) {
    const f = { id: nextFollowId++, adoption_id: id, notes, status, date: new Date().toISOString() };
    mockFollowUps.push(f);
    return res.json({ success: true, followup: f });
  }
  try {
    const [result] = await pool!.execute('INSERT INTO adoption_followups (adoption_id, notes, status) VALUES (?, ?, ?)', [id, notes, status]);
    res.json({ success: true, followup: { id: (result as any).insertId, adoption_id: id, notes, status, date: new Date().toISOString() } });
  } catch (e) { res.status(500).json({ success: false, message: 'Error del servidor' }); }
});

// Vite middleware for development
async function startServer() {
  await initDB();
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
    app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));
  }
}

startServer();

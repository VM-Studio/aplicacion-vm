# ✅ CHECKLIST: Configuración Supabase en 10 Minutos

## 🎯 OBJETIVO

Configurar tu base de datos Supabase completamente funcional con 11 tablas, 40+ índices optimizados, y datos de prueba.

---

## 📝 PASO A PASO

### ☐ 1. ACCEDER A SUPABASE (2 min)

**Acciones:**

```
1. Ir a: https://app.supabase.com
2. Iniciar sesión
3. Click en "New Project"
```

**Configuración:**

```
Name: vm-studio-dev
Database Password: [Generar y GUARDAR]
Region: South America (São Paulo)
Plan: Free (para desarrollo)
```

**✅ Verificación:**

- [ ] Proyecto creado
- [ ] Pantalla del dashboard visible
- [ ] Contraseña guardada en lugar seguro

---

### ☐ 2. EJECUTAR SCRIPT COMPLETO (3 min)

**Acciones:**

```
1. En el menú izquierdo → SQL Editor
2. Click en "New query"
3. Copiar TODO el archivo: supabase-completo-todo-en-uno.sql
4. Pegar en el editor
5. Click en "Run" (o Ctrl+Enter)
```

**⏳ Tiempo de ejecución:** 10-30 segundos

**✅ Verificación:**

```
Mensaje esperado: "Success. No rows returned"

Si ves errores:
- Ignorar "already exists" (significa que ya estaba creado)
- Si hay otros errores, copiarlos y reportarlos
```

- [ ] Script ejecutado sin errores críticos
- [ ] Mensaje de éxito mostrado

---

### ☐ 3. VERIFICAR TABLAS CREADAS (1 min)

**Acciones:**

```
1. En el menú izquierdo → Table Editor
2. Verificar que aparezcan estas 11 tablas:
```

**Lista de tablas:**

- [ ] ✅ clients
- [ ] ✅ projects
- [ ] ✅ messages
- [ ] ✅ notifications
- [ ] ✅ payments
- [ ] ✅ meetings
- [ ] ✅ budgets
- [ ] ✅ documents
- [ ] ✅ users
- [ ] ✅ activity_logs
- [ ] ✅ modificaciones

**✅ Verificación:**

- [ ] Las 11 tablas están visibles
- [ ] Al hacer click en cada tabla se ve su estructura

---

### ☐ 4. OBTENER CREDENCIALES (2 min)

**Acciones:**

```
1. En el menú izquierdo → Settings (⚙️)
2. Click en "API"
3. Buscar la sección "Project URL"
4. Copiar los siguientes valores:
```

**Copiar y guardar:**

```
Project URL: https://XXXXXXXX.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc...
```

**✅ Verificación:**

- [ ] Project URL copiada
- [ ] anon public key copiada
- [ ] Ambas guardadas temporalmente (las vas a necesitar)

---

### ☐ 5. CONFIGURAR .ENV.LOCAL (2 min)

**Acciones:**

```
1. Abrir tu proyecto en VS Code
2. Crear archivo .env.local en la raíz
3. Pegar el siguiente contenido:
```

**Contenido de .env.local:**

```bash
# SUPABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ENVIRONMENT
NEXT_PUBLIC_ENV=development
NODE_ENV=development
```

**⚠️ IMPORTANTE:**

```
1. Reemplazar XXXXXXXX con tu Project URL real
2. Reemplazar eyJhbG... con tu anon key real
3. Verificar que .env.local esté en .gitignore
```

**✅ Verificación:**

- [ ] Archivo .env.local creado
- [ ] Variables reemplazadas con tus valores reales
- [ ] Archivo en .gitignore

---

### ☐ 6. PROBAR CONEXIÓN (2 min)

**Acciones:**

```bash
# En la terminal de tu proyecto
npm run dev
```

**Abrir navegador:**

```
http://localhost:3000
```

**✅ Verificación:**

- [ ] El servidor inicia sin errores
- [ ] La página carga correctamente
- [ ] No hay errores en la consola del navegador (F12)
- [ ] Se ve la pantalla de login

---

### ☐ 7. TEST DE LOGIN (1 min)

**Datos de prueba creados automáticamente:**

```
Usuario Admin:
  Username: admin
  Password: 123

Usuario Cliente:
  Username: cliente1
  Password: 123
```

**Acciones:**

```
1. Ir a la página de login
2. Ingresar: admin / 123
3. Intentar hacer login
```

**✅ Verificación:**

- [ ] Login funciona correctamente
- [ ] Redirige al dashboard
- [ ] Se pueden ver datos (aunque estén vacíos)

---

## 🎉 ¡COMPLETADO!

Si todos los checkboxes están marcados, tu Supabase está **100% funcional**.

---

## 📊 RESUMEN DE LO QUE TIENES

### Base de Datos

```
✅ 11 tablas creadas
✅ 40+ índices de optimización
✅ Row Level Security habilitado
✅ Políticas de seguridad configuradas
```

### Performance

```
✅ Queries 10-40x más rápidas con índices
✅ Búsqueda full-text en mensajes
✅ Índices compuestos para queries comunes
✅ Estadísticas del optimizador actualizadas
```

### Seguridad

```
✅ RLS habilitado en todas las tablas
✅ Políticas básicas configuradas
✅ Listo para agregar políticas por rol
```

### Usuarios de Prueba

```
✅ Admin: admin / 123
✅ Cliente: cliente1 / 123
⚠️ CAMBIAR CONTRASEÑAS EN PRODUCCIÓN
```

---

## 🚨 SOLUCIÓN RÁPIDA DE PROBLEMAS

### ❌ "Cannot connect to Supabase"

**Solución:**

```bash
1. Verificar que .env.local exista
2. Verificar que las URLs sean correctas
3. Reiniciar: npm run dev
```

### ❌ "Row Level Security error"

**Solución:**

```
1. Ir a Supabase SQL Editor
2. Ejecutar el PASO 4 del script (políticas)
```

### ❌ "Table does not exist"

**Solución:**

```
1. Volver a ejecutar el script completo
2. Verificar en Table Editor que las tablas existan
```

### ❌ Login no funciona

**Solución:**

```
1. Verificar que la tabla users tenga datos:
   - Ir a Table Editor → users
   - Debería haber 2 usuarios
2. Si está vacía, ejecutar PARTE 6 del script
```

---

## 📚 ARCHIVOS DE REFERENCIA

**Para ejecutar en Supabase:**

- `supabase-completo-todo-en-uno.sql` ← **Ejecutar este primero**

**Para entender la estructura:**

- `SUPABASE-SETUP-COMPLETO.md` ← Guía detallada paso a paso
- `DATABASE-CHECKLIST.md` ← Checklist de optimización
- `DATABASE_SCHEMA.md` ← Documentación de tablas

**Para optimización:**

- `sql-indices-optimizacion.sql` ← Índices (ya incluido en el script completo)
- `sql-verificar-indices.sql` ← Para verificar índices

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### Inmediato (Hoy)

- [ ] Crear primer cliente de prueba
- [ ] Crear primer proyecto de prueba
- [ ] Probar enviar mensajes
- [ ] Verificar que todo funcione

### Esta Semana

- [ ] Cambiar contraseñas de usuarios de prueba
- [ ] Configurar backup automático (ver BACKUPS-GUIDE.md)
- [ ] Crear más usuarios según necesites

### Antes de Producción

- [ ] Crear proyecto staging en Supabase
- [ ] Crear proyecto production en Supabase
- [ ] Implementar autenticación con bcrypt
- [ ] Configurar políticas RLS específicas por rol
- [ ] Ejecutar script de verificación de índices

---

## ✅ CHECKLIST FINAL

Marca cuando esté todo listo:

- [ ] ✅ Proyecto Supabase creado
- [ ] ✅ Script completo ejecutado
- [ ] ✅ 11 tablas verificadas
- [ ] ✅ Credenciales configuradas en .env.local
- [ ] ✅ Aplicación corriendo localmente
- [ ] ✅ Login funcionando con usuario de prueba
- [ ] ✅ Sin errores en consola del navegador
- [ ] ✅ Backups automáticos verificados (Settings → Database)

---

**🎬 ¡Tu base de datos VM Studio está lista para funcionar!**

_Tiempo total estimado: 10-15 minutos_

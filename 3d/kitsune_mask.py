"""
Neo-Fox Kitsune Mask v6 — Hard Surface Pro
Профессиональный подход:
  • Y=0.80 (не диск, не шар)
  • Bevel modifier на всех панелях → нет граней Minecraft
  • Clearcoat на белом → лакированный пластик
  • Тонкий визор-полоска вместо куба-глазницы
  • Forehead brow guard вместо уродского crown-куба
"""
import bpy, bmesh, os, math

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ── МАТЕРИАЛЫ ─────────────────────────────────────────────────────────────────
def make_mat(name, color, metallic=0.0, roughness=0.2,
             emit=None, emit_str=0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    n, l = m.node_tree.nodes, m.node_tree.links
    n.clear()
    b = n.new('ShaderNodeBsdfPrincipled')
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Metallic'].default_value   = metallic
    b.inputs['Roughness'].default_value  = roughness
    if coat > 0:
        b.inputs['Coat Weight'].default_value    = coat
        b.inputs['Coat Roughness'].default_value = 0.05
    if emit:
        b.inputs['Emission Color'].default_value    = (*emit, 1)
        b.inputs['Emission Strength'].default_value = emit_str
    o = n.new('ShaderNodeOutputMaterial')
    l.new(b.outputs[0], o.inputs[0])
    return m

M_white = make_mat('White',   (0.92, 0.92, 0.94), metallic=0.05, roughness=0.10, coat=0.65)
M_black = make_mat('Black',   (0.02, 0.02, 0.03), metallic=0.20, roughness=0.22)
M_red   = make_mat('RedGlow', (0.0,  0.0,  0.0 ), metallic=0,    roughness=1,
                   emit=(1.0, 0.04, 0.02), emit_str=50)
M_dark  = make_mat('Dark',    (0.06, 0.06, 0.08), metallic=0.30, roughness=0.30)

# ── УТИЛИТА: Bevel (профессиональные скосы рёбер) ─────────────────────────────
def add_bevel(ob, width=0.018, segs=3):
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.modifier_add(type='BEVEL')
    ob.modifiers['Bevel'].width        = width
    ob.modifiers['Bevel'].segments     = segs
    ob.modifiers['Bevel'].limit_method = 'ANGLE'
    ob.modifiers['Bevel'].angle_limit  = 0.52   # ~30°

# ── ГОЛОВА ────────────────────────────────────────────────────────────────────
# Y=0.80: сбоку не диск (0.65) и не шар (0.90)
bpy.ops.mesh.primitive_uv_sphere_add(segments=72, ring_count=56, radius=1.0)
head = bpy.context.object
head.name = 'Head'
head.scale = (1.08, 0.80, 1.45)

bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(head.data)
for v in bm.verts:
    x, y, z = v.co.x, v.co.y, v.co.z
    if -0.30 < z < 0.28:           # расширяем скулы
        v.co.x = x * 1.10
    if z < -0.48:                   # сужаем подбородок
        t = min((-z - 0.48) / 0.52, 1.0)
        v.co.x = x * (1 - t * 0.62)
        v.co.y = y * (1 - t * 0.25)
    if y > 0.55:                    # сглаживаем затылок
        v.co.y = 0.55 + (y - 0.55) * 0.65
    if y < -0.72:                   # немного выравниваем лицо
        v.co.y = -0.72 + (y + 0.72) * 0.65
bmesh.update_edit_mesh(head.data)
bpy.ops.object.mode_set(mode='OBJECT')

bpy.ops.object.modifier_add(type='SUBSURF')
head.modifiers['Subdivision'].levels = 1
bpy.ops.object.shade_smooth()
head.data.materials.append(M_white)

# ── МОРДА ─────────────────────────────────────────────────────────────────────
# поверхность лица при x=0, z=-0.25, Y=0.80 → y ≈ -0.77  →  морда на -0.86
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=1.0)
snout = bpy.context.object
snout.name = 'Snout'
snout.scale = (0.26, 0.48, 0.18)
snout.location = (0, -0.86, -0.25)

bpy.ops.object.mode_set(mode='EDIT')
bm_s = bmesh.from_edit_mesh(snout.data)
for v in bm_s.verts:
    if v.co.y < -0.05:
        t = (-v.co.y - 0.05) / 0.95
        v.co.x *= (1 - t * 0.80)
        v.co.z *= (1 - t * 0.70)
bmesh.update_edit_mesh(snout.data)
bpy.ops.object.mode_set(mode='OBJECT')

bpy.ops.object.modifier_add(type='SUBSURF')
snout.modifiers['Subdivision'].levels = 2
bpy.ops.object.shade_smooth()
snout.data.materials.append(M_white)

# Нос — маленький, чёрный, плоский
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=12, radius=0.050)
nose = bpy.context.object
nose.name = 'Nose'
nose.location = (0, -1.32, -0.26)
nose.scale = (1.05, 0.52, 0.80)
nose.data.materials.append(M_black)

# ── УШИ ──────────────────────────────────────────────────────────────────────
# z_поверхности при x=0.48, y≈0: 1.45*sqrt(1-(0.48/1.08)²) ≈ 1.30
# Основание уха на z=1.24 — чуть ниже поверхности, solidify выдавливает наружу
def make_ear(side):
    verts = [
        (0,           0,    0   ),
        (side*0.28,  -0.04, 0.15),
        (side*0.12,  -0.08, 1.00),  # высокое острое ухо
    ]
    me = bpy.data.meshes.new('EarMesh')
    ob = bpy.data.objects.new('Ear', me)
    bpy.context.collection.objects.link(ob)
    me.from_pydata(verts, [], [(0, 1, 2)])
    me.update()
    ob.location      = (side * 0.48, -0.10, 1.24)
    ob.rotation_euler = (0.04, side * 0.07, side * 0.05)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.modifier_add(type='SOLIDIFY')
    ob.modifiers['Solidify'].thickness = 0.11
    ob.modifiers['Solidify'].offset    = 1.0
    bpy.ops.object.modifier_add(type='SUBSURF')
    ob.modifiers['Subdivision'].levels = 2
    bpy.ops.object.shade_smooth()
    ob.data.materials.append(M_white)

    # Чёрная внутренняя панель
    vi = [
        (side*0.04,  0.06, 0.07),
        (side*0.20,  0.06, 0.15),
        (side*0.09,  0.06, 0.80),
    ]
    mi = bpy.data.meshes.new('EarInMesh')
    oi = bpy.data.objects.new('EarIn', mi)
    bpy.context.collection.objects.link(oi)
    mi.from_pydata(vi, [], [(0, 1, 2)])
    mi.update()
    oi.location       = ob.location
    oi.rotation_euler = ob.rotation_euler
    bpy.context.view_layer.objects.active = oi
    bpy.ops.object.modifier_add(type='SOLIDIFY')
    oi.modifiers['Solidify'].thickness = 0.012
    oi.data.materials.append(M_black)

make_ear( 1)
make_ear(-1)

# ── BROW GUARD (заменяет уродской crown-куб) ──────────────────────────────────
# Тонкая горизонтальная пластина у основания ушей / над глазами
bpy.ops.mesh.primitive_cube_add()
brow = bpy.context.object
brow.name = 'BrowGuard'
brow.scale          = (0.54, 0.090, 0.038)
brow.location       = (0, -0.68, 0.98)
brow.rotation_euler = (0.08, 0, 0)
brow.data.materials.append(M_black)
add_bevel(brow, width=0.012, segs=3)

# ── ГЛАЗА ─────────────────────────────────────────────────────────────────────
# y_поверхности при x=0.38, z=0.18, scale (1.08,0.80,1.45) после vertex edit:
# raw: -0.80*sqrt(1-(0.38/1.08)²-(0.18/1.45)²) = -0.80*0.928 ≈ -0.742
# после flatten-y (-0.72+…*0.65): ≈ -0.735
def make_eye(side):
    x    = side * 0.38
    tilt = side * -0.28   # внешний угол выше

    # Тонкая тёмная полоска-визор (не куб-кирпич!)
    bpy.ops.mesh.primitive_cube_add()
    sock = bpy.context.object
    sock.scale          = (0.210, 0.011, 0.062)
    sock.location       = (x, -0.740, 0.176)
    sock.rotation_euler = (0, 0, tilt)
    sock.data.materials.append(M_black)
    add_bevel(sock, width=0.007, segs=2)

    # Красный V-glow — тонкие лучи
    cx, cy, cz = x, -0.758, 0.162

    bpy.ops.mesh.primitive_cube_add()
    a1 = bpy.context.object
    a1.scale          = (0.095, 0.011, 0.012)
    a1.location       = (cx - side*0.072, cy, cz + 0.030)
    a1.rotation_euler = (0, 0, tilt + side*0.55)
    a1.data.materials.append(M_red)

    bpy.ops.mesh.primitive_cube_add()
    a2 = bpy.context.object
    a2.scale          = (0.095, 0.011, 0.012)
    a2.location       = (cx + side*0.072, cy, cz + 0.030)
    a2.rotation_euler = (0, 0, tilt - side*0.55)
    a2.data.materials.append(M_red)

    bpy.ops.mesh.primitive_cube_add()
    stem = bpy.context.object
    stem.scale          = (0.010, 0.011, 0.028)
    stem.location       = (cx, cy, cz - 0.008)
    stem.rotation_euler = (0, 0, tilt)
    stem.data.materials.append(M_red)

make_eye( 1)
make_eye(-1)

# ── ЩЁЧНЫЕ ПАНЕЛИ ─────────────────────────────────────────────────────────────
for side in (1, -1):
    bpy.ops.mesh.primitive_cube_add()
    ck = bpy.context.object
    ck.scale          = (0.074, 0.065, 0.192)
    ck.location       = (side * 0.94, -0.30, 0.01)
    ck.rotation_euler = (0, side * -0.50, 0)
    ck.data.materials.append(M_black)
    add_bevel(ck, width=0.012, segs=3)

    bpy.ops.mesh.primitive_cube_add()
    strip = bpy.context.object
    strip.scale          = (0.010, 0.048, 0.152)
    strip.location       = (side * 0.89, -0.28, 0.01)
    strip.rotation_euler = (0, side * -0.50, 0)
    strip.data.materials.append(M_dark)

# ── ПОДБОРОДОК ────────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add()
chin = bpy.context.object
chin.name  = 'Chin'
chin.scale = (0.44, 0.19, 0.082)
chin.location = (0, -0.63, -0.87)
chin.data.materials.append(M_black)
add_bevel(chin, width=0.015, segs=3)

for side in (1, -1):
    bpy.ops.mesh.primitive_cube_add()
    jaw = bpy.context.object
    jaw.scale    = (0.074, 0.155, 0.068)
    jaw.location = (side * 0.48, -0.51, -0.82)
    jaw.data.materials.append(M_black)
    add_bevel(jaw, width=0.010, segs=2)

bpy.ops.mesh.primitive_cube_add()
neck = bpy.context.object
neck.scale    = (0.46, 0.13, 0.015)
neck.location = (0, -0.61, -0.97)
neck.data.materials.append(M_dark)

# ── ДЕКОР-ЛИНИИ ───────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add()
fv = bpy.context.object
fv.scale    = (0.012, 0.007, 0.100)
fv.location = (0, -0.75, 0.64)
fv.data.materials.append(M_black)

bpy.ops.mesh.primitive_cube_add()
fh = bpy.context.object
fh.scale    = (0.37, 0.007, 0.007)
fh.location = (0, -0.74, 0.07)
fh.data.materials.append(M_black)

# ── ЭКСПОРТ ───────────────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kitsune_mask.glb')
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB',
                           export_apply=True, export_lights=False,
                           export_materials='EXPORT')
print(f'\n✓ {out}\n')

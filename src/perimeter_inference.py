import trimesh
import trimesh.exchange

import numpy as np
from pyodide import to_js

def make_ones(jsarray):
    ary = jsarray.to_py()
    return np.ones(ary)

def make_eye(num):
    return np.eye(num)

def get_tuple(num):
    a = np.arange(num, dtype=np.float32)
    b = np.arange(num, dtype=np.float32)
    return to_js(a), to_js(b)


JOINT_NAMES = [
    "wrist",
    "index1",
    "index2",
    "index3",
    "middle1",
    "middle2",
    "middle3",
    "pinky1",
    "pinky2",
    "pinky3",
    "ring1",
    "ring2",
    "ring3",
    "thumb1",
    "thumb2",
    "thumb3",
    "thumb_tip",
    "index_tip",
    "middle_tip",
    "ring_tip",
    "pinky_tip",
]

def load_ring(joint_list):
    #print(f"joint_list: {joint_list}")
    #j = np.load("data/joint.npy", allow_pickle=True)
    #joint_dict = dict(zip(JOINT_NAMES, joint_list))
    ring1 = joint_list[13]# joint_dict["ring1"]
    ring2 = joint_list[14]#["ring2"]
    ring3 = joint_list[15]#["ring3"]
    ring_tip = joint_list[16]# joint_dict["ring_tip"]
    return ring1, ring2, ring3, ring_tip

def calc_finger_length(ring1, ring2, ring3, ring_tip):
    sum = 0
    distance = np.linalg.norm(ring1 - ring2)
    sum += distance
    distance = np.linalg.norm(ring2 - ring3)
    sum += distance
    distance = np.linalg.norm(ring3 - ring_tip)
    sum += distance
    return sum

def calc_ring_contact_part_mesh(*, hand_mesh, ring1_point, ring2_point):
    # カットしたい平面の起点と法線ベクトルを求める
    plane_normal = ring2_point - ring1_point
    plane_origin = (ring1_point + ring2_point) / 2
    # 上記の平面とメッシュの交わる面を求める
    _, face_index = trimesh.intersections.mesh_plane(
        hand_mesh, plane_normal, plane_origin, return_faces=True
    )
    new_triangles = trimesh.Trimesh(hand_mesh.vertices, hand_mesh.faces[face_index])
    # 起点と最も近い面(三角形)を求める
    center_points = np.average(new_triangles.vertices[new_triangles.faces], axis=1)
    distances = np.linalg.norm(
        center_points - np.expand_dims(plane_origin, 0), axis=1
    )
    triangle_id = np.argmin(distances)
    print(f"closest triangle_id: {triangle_id}")
    # 上記の三角形を含む、連なったグループを求める
    closest_face_index = None
    for face_index in trimesh.graph.connected_components(new_triangles.face_adjacency):
        if triangle_id in face_index:
            closest_face_index = face_index

    new_face_index = new_triangles.faces[closest_face_index]
    ring_contact_part = trimesh.Trimesh(new_triangles.vertices, new_face_index)
    return ring_contact_part

from scipy.spatial import ConvexHull
from scipy.spatial.distance import euclidean
from sklearn.decomposition import PCA


def calc_ring_perimeter(ring_contact_part_mesh):
    v = ring_contact_part_mesh.vertices[ring_contact_part_mesh.faces]
    # メッシュを構成する三角形の重心部分を求める
    center_points = np.mean(v, axis=1)
    # PCAで次元削減及び２次元へ投影
    pca = PCA(n_components=3)
    pca.fit(center_points)
    vert_2d = np.dot(center_points, pca.components_.T[:, :2])
    # ConvexHullで均してから外周を測る
    hull = ConvexHull(vert_2d)
    vertices = hull.vertices.tolist() + [hull.vertices[0]]
    perimeter = np.sum(
        [euclidean(x, y) for x, y in zip(vert_2d[vertices], vert_2d[vertices][1:])]
    )
    return perimeter, center_points


def make_mesh_from_vertex(jsarray_vertex, jsarray_faces, jsarray_joints):
    joints_np = np.array(jsarray_joints.to_py()).reshape(-1, 3)
    ring1, ring2, ring3, ring_tip = load_ring(joints_np)
    finger_length = calc_finger_length(ring1, ring2, ring3, ring_tip)
    print(f"finger_length: {finger_length}")
    # print(f"ring1: {ring1}")
    # print(f"ring2: {ring2}")

    vertex_np = np.array(jsarray_vertex.to_py()).reshape(778, 3)
    faces_np = np.array(jsarray_faces.to_py(), dtype='int').reshape(-1, 3)

    hand_mesh = trimesh.Trimesh(vertices=vertex_np, faces=faces_np)
    #hand_mesh = trimesh.Trimesh(**hand_mesh_params)
    ring_contact_part_mesh = calc_ring_contact_part_mesh(
        hand_mesh=hand_mesh, ring1_point=ring1, ring2_point=ring2
    )
    perimeter, center_points = calc_ring_perimeter(ring_contact_part_mesh)
    print(f"perimeter: {perimeter}")
    print(f"Ratio: {perimeter / finger_length}")
    return to_js(ring1), to_js(ring2)

# def load_as_faces(jsarray):
#     py_list = jsarray.to_py()
#     faces = np.array(py_list, dtype='int').reshape(-1, 3)
#     print(faces)

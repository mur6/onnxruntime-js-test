import trimesh
import trimesh.exchange

import numpy as np

def make_ones(jsarray):
    ary = jsarray.to_py()
    return np.ones(ary)

def make_eye(num):
    return np.eye(num)
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
    #j = np.load("data/joint.npy", allow_pickle=True)
    joint_dict = dict(zip(JOINT_NAMES, joint_list))
    ring1 = joint_dict["ring1"]
    ring2 = joint_dict["ring2"]
    ring3 = joint_dict["ring3"]
    ring_tip = joint_dict["ring_tip"]
    return ring1, ring2, ring3, ring_tip


def make_mesh_from_vertex(jsarray_vertex, jsarray_faces, jsarray_joints):
    vertex_np = np.array(jsarray_vertex.to_py()).reshape(778, 3)
    faces_np = np.array(jsarray_faces.to_py(), dtype='int').reshape(-1, 3)
    joint_list = jsarray_joints.to_py()
    r = load_ring(joint_list)
    print(r)
    data = trimesh.Trimesh(vertices=vertex_np, faces=faces_np)
    print(data)

def load_as_faces(jsarray):
    py_list = jsarray.to_py()
    faces = np.array(py_list, dtype='int').reshape(-1, 3)
    print(faces)

# def make_mesh(jsarray):
#     py_list = jsarray.to_py()
#     np.array(py_list).reshape()

#     #.reshape(2, 2)
#     return 

# def make_ones(jsarray):
#     hand_mesh = trimesh.Trimesh(**hand_mesh_params)
#     ary = jsarray.to_py()
#     return numpy.ones(ary)

# def make_eye(num):
#     return numpy.eye(num)

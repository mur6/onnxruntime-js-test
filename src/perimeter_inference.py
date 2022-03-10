import trimesh
import trimesh.exchange

import numpy as np

def make_ones(jsarray):
    ary = jsarray.to_py()
    return np.ones(ary)

def make_eye(num):
    return np.eye(num)

def make_mesh_from_vertex(jsarray_vertex, jsarray_faces):
    vertex_np = np.array(jsarray_vertex.to_py()).reshape(778, 3)
    faces_np = np.array(jsarray_faces.to_py(), dtype='int').reshape(-1, 3)
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

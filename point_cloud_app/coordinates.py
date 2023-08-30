import laspy


def get_x(url):
    las = laspy.read(url)
    return list(las.x)


def get_y(url):
    las = laspy.read(url)
    return list(las.y)


def get_z(url):
    las = laspy.read(url)
    return list(las.z)


def get_coord(url):
    las = laspy.read(url)
    return list(las.xyz)

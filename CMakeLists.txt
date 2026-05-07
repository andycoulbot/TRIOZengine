cmake_minimum_required(VERSION 3.21...3.31)
project(TRIOZengine VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# ── Options ──────────────────────────────────────────────────────────────────
option(TRIOZ_BUILD_TESTS "Build unit tests" OFF)

# ── Dependencies via FetchContent ────────────────────────────────────────────
include(FetchContent)

# GLFW 3.4 (Feb 2024)
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_WAYLAND OFF CACHE BOOL "" FORCE)
FetchContent_Declare(glfw
    GIT_REPOSITORY https://github.com/glfw/glfw.git
    GIT_TAG        3.4
)

# GLM 1.0.3 (Dec 2025)
FetchContent_Declare(glm
    GIT_REPOSITORY https://github.com/g-truc/glm.git
    GIT_TAG        1.0.3
)

# Assimp 6.0.4 (Jan 2026)
set(ASSIMP_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(ASSIMP_INSTALL OFF CACHE BOOL "" FORCE)
set(ASSIMP_BUILD_ASSIMP_TOOLS OFF CACHE BOOL "" FORCE)
FetchContent_Declare(assimp
    GIT_REPOSITORY https://github.com/assimp/assimp.git
    GIT_TAG        v6.0.4
)

# Dear ImGui 1.92.7 (Apr 2026)
FetchContent_Declare(imgui
    GIT_REPOSITORY https://github.com/ocornut/imgui.git
    GIT_TAG        v1.92.7
)

FetchContent_MakeAvailable(glfw glm assimp imgui)

# ── GLAD (OpenGL loader) ────────────────────────────────────────────────────
add_library(glad STATIC
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/glad/src/gl.c
)
target_include_directories(glad PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/glad/include
)

# ── stb_image ────────────────────────────────────────────────────────────────
add_library(stb_image INTERFACE)
target_include_directories(stb_image INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/stb
)

# ── Dear ImGui library ──────────────────────────────────────────────────────
set(IMGUI_DIR ${imgui_SOURCE_DIR})
add_library(imgui_lib STATIC
    ${IMGUI_DIR}/imgui.cpp
    ${IMGUI_DIR}/imgui_demo.cpp
    ${IMGUI_DIR}/imgui_draw.cpp
    ${IMGUI_DIR}/imgui_tables.cpp
    ${IMGUI_DIR}/imgui_widgets.cpp
    ${IMGUI_DIR}/backends/imgui_impl_glfw.cpp
    ${IMGUI_DIR}/backends/imgui_impl_opengl3.cpp
)
target_include_directories(imgui_lib PUBLIC
    ${IMGUI_DIR}
    ${IMGUI_DIR}/backends
)
target_link_libraries(imgui_lib PUBLIC glfw glad)

# ── Collect engine sources ──────────────────────────────────────────────────
file(GLOB_RECURSE ENGINE_SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp
)

add_executable(TRIOZengine
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp
    ${ENGINE_SOURCES}
)

target_include_directories(TRIOZengine PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/stb
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/glad/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/nlohmann
)

target_link_libraries(TRIOZengine PRIVATE
    glad
    glfw
    glm::glm
    assimp
    imgui_lib
    stb_image
)

# Linux-specific
if(UNIX AND NOT APPLE)
    target_link_libraries(TRIOZengine PRIVATE dl pthread)
endif()

# Copy assets to build directory
add_custom_command(TARGET TRIOZengine POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
        ${CMAKE_CURRENT_SOURCE_DIR}/assets
        $<TARGET_FILE_DIR:TRIOZengine>/assets
)
